# Resume source

`resume.html` is the editable source for `assets/Ruslan_Unity_Developer_CV.pdf`.

Serve the repository over local HTTP and open `/tools/resume.html` in Chromium.
Print to PDF with A4 paper, CSS page sizing, background graphics enabled, and browser headers/footers disabled.
The stylesheet defines the page margins. The current output is one page.

For Playwright, use `page.pdf({ path: 'assets/Ruslan_Unity_Developer_CV.pdf', printBackground: true, preferCSSPageSize: true })` after loading the source page.

After changing content, render and inspect the PDF to check page count, clipping and links.
Update the PDF cache version in `index.html` when replacing the published document.

Content note: exact Bulltraffic and current playable-role employment dates have not been confirmed. They are intentionally omitted rather than inferred from the previous resume's open-ended date range.
