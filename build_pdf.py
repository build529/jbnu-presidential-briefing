"""Regenerate the static chart and five-page PDF from the editable project.
Run in your Codespace: pip install -r requirements.txt && python build_pdf.py
No server is started. analytics.js must contain a JSON-compatible object literal.
"""
from pathlib import Path
import json, io, logging
from html import escape
from bs4 import BeautifulSoup
import tinycss2
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from weasyprint import HTML
import pymupdf as fitz

ROOT = Path(__file__).resolve().parent

def analytics():
    text = (ROOT/'analytics.js').read_text()
    return json.loads(text[text.index('{'):text.rindex('}')+1])

def main():
    stats = analytics()
    rows = stats['weeklyAverages']
    assert rows and all(isinstance(r['average'],(int,float)) and r['average']>=0 for r in rows)
    fig, ax = plt.subplots(figsize=(10.2,3.4),dpi=160,facecolor='white')
    ax.set_facecolor('white')
    values = [r['average'] for r in rows]
    bars = ax.bar(range(len(rows)),values,width=.48,color='#1751D0',zorder=3)
    ax.set_ylim(0,__import__('math').ceil(max(values)*1.15/50)*50)
    ax.set_xticks(range(len(rows)),[r['label']+'\n'+r['dates'] for r in rows],fontsize=10,color='#505A74')
    ax.tick_params(axis='y',labelsize=9,colors='#505A74',length=0)
    ax.tick_params(axis='x',length=0,pad=10)
    from matplotlib.ticker import MaxNLocator
    ax.yaxis.set_major_locator(MaxNLocator(nbins=3,integer=True))
    ax.grid(axis='y',color='#E2E6F0',linewidth=.7,zorder=0)
    for side in ['top','right','left']: ax.spines[side].set_visible(False)
    ax.spines['bottom'].set_color('#CDD3E0')
    for b,v in zip(bars,values): ax.text(b.get_x()+b.get_width()/2,v+max(values)*.035,f'{v:g}',ha='center',va='bottom',fontsize=12,fontweight='bold',color='#1E2433')
    fig.subplots_adjust(left=.05,right=.99,top=.91,bottom=.23)
    fig.savefig(ROOT/'assets/usage-chart.png',dpi=160,facecolor='white');plt.close(fig)
    # Sync no-JS / print values with the editable data.
    soup=BeautifulSoup((ROOT/'index.html').read_text(),'html.parser')
    last=rows[-1]
    soup.select_one('#latestAverage').string=f"{last['average']:g}"
    soup.select_one('#latestDates').string=last['fullDates']
    soup.select_one('.metric-label').string=stats['latestLabel']
    soup.select_one('#usageNote').string=stats['periodLabel']+' · '+stats['method']
    soup.select_one('.chart-source').string='Source: '+stats['source']+('' if stats['isCurrent'] else ' · Not a current live metric')
    soup.select_one('#chartFallback')['alt']='Average daily users: '+ '; '.join(f"{r['label']}, {r['average']}" for r in rows)
    (ROOT/'index.html').write_text(soup.prettify())
    # Use the same desktop typography; omit browser-only animation/responsive rules.
    css=(ROOT/'styles.css').read_text()
    rules=tinycss2.parse_stylesheet(css,skip_comments=True,skip_whitespace=True)
    clean=[]
    for rule in rules:
        if rule.type=='at-rule' and rule.lower_at_keyword in ['property','keyframes']:continue
        if rule.type=='at-rule' and rule.lower_at_keyword=='media':
            if tinycss2.serialize(rule.prelude).strip()!='print':continue
        if rule.type=='qualified-rule':
            selector=tinycss2.serialize(rule.prelude)
            if any(w in selector for w in ['dialog','::backdrop','.metric-ring.draw','.slide.active.enter']):continue
        clean.append(tinycss2.serialize([rule]))
    for tag in soup.select('script, link[rel=stylesheet], dialog, .toolbar, .progress, noscript'):tag.decompose()
    soup.body['class']=['pdf']
    style=soup.new_tag('style');style.string='\n'.join(clean);soup.head.append(style)
    log=logging.getLogger('weasyprint');handler=logging.FileHandler(ROOT/'pdf-build.log',mode='w');log.addHandler(handler)
    raw=HTML(string=str(soup),base_url=str(ROOT)).write_pdf()
    log.removeHandler(handler);handler.close()
    doc=fitz.open(stream=raw,filetype='pdf')
    assert len(doc)==5,f'Expected 5 pages, got {len(doc)}'
    doc.set_metadata({'title':'Continuing My Contribution at JBNU','author':'Jose Aldonate','subject':'Academic continuity, scholarship support and next steps'})
    dest=ROOT/'documents/JBNU_Presidential_Briefing.pdf'
    doc.save(dest,garbage=4,deflate=True)
    for i,page in enumerate(doc):
        blocks=page.get_text('blocks')
        outside=[b for b in blocks if b[0]<-1 or b[1]<-1 or b[2]>1201 or b[3]>676]
        assert not outside,f'Off-page text on page {i+1}: {outside}'
    print(f'Built {dest.name}: {len(doc)} pages, {dest.stat().st_size:,} bytes. Chart and static values updated.')
    print('Browser-only behaviors still require testing in your preview.')

if __name__=='__main__':main()
