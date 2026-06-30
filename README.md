# Better Together Consulting Website

This is a static website for Better Together Consulting. It uses plain HTML, CSS, and a small JavaScript file, so it is easy to edit and does not require a build step.

## Run Locally

Open `index.html` directly in a browser.

Optional local server:

```powershell
py -m http.server 8080
```

Then visit `http://localhost:8080` from this folder.

## Edit Text

Most website copy is in `index.html`. Search for the section name you want to update, such as `About`, `Services`, `Workshops`, `Resources`, `Testimonials`, or `Contact`.

## Edit Styles

Colors, spacing, layout, and responsive behavior are in `styles.css`. The main brand colors are defined near the top in the `:root` block.

## Replace Images

The hero image is located at `assets/school-leadership-hero.png`. Replace that file with a new image using the same filename, or update the image path in `index.html`.

The About section includes a headshot placeholder. Replace the placeholder block in `index.html` with an image when a professional headshot is ready.

## Notes

- No payment processing is included.
- No login system is included.
- No student data features are included.
- The contact form uses `mailto:` for now. For production, connect it to a secure form service or a backend endpoint.
