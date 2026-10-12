[README.txt](https://github.com/user-attachments/files/33346544/README.txt)
Command a Room, the website files
=================================

What is in this folder
- index.html            the homepage
- apply/index.html      the application page (posts to your Google Sheet, then sends people to Calendly)
- assets/               photos, diagrams, the signature, the share image, and the two small scripts
- favicon.ico, favicon.png, apple-touch-icon.png
- robots.txt, sitemap.xml
- 404.html              a page for addresses that do not exist

How to go live
Upload everything in this folder to the place your current site is served from, keeping the folder
structure exactly as it is here. On Railway that means either committing these files to the GitHub
repo the service deploys from, or replacing the files in your project folder and running
"railway up". Your domain and DNS do not change.

All links on the site are root-relative (/apply/, /assets/...), so the files must sit at the root of
the site, not in a subfolder.
