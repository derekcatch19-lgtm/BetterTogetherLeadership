# School Communication Hub Starter

A code-first, school-neutral starter for a public announcements page and a staff resource hub. It includes a complete communication and staff-resource structure without including any real school branding, staff information, passwords, links, or documents.

## What Is Included

- Public home page with current online announcements
- Communication area with today's announcements, submission form, online announcements, archive, daily messages, presenter mode, and an approval queue
- Staff Hub with Quick Access, Staff Resources, Forms Center, Who Do I Contact, New Teacher Corner, and Staff Recognition
- Searchable handbook, instructional toolkit, data and assessment area, and calendar shell
- Responsive desktop/mobile layout and print-friendly presenter mode
- Browser-local demonstration storage so the announcement workflow can be tested before a database is connected

## Start Here

1. Open `school.config.js` and replace the school name, tagline, colors, contacts, cards, and links.
2. Replace `assets/logo-placeholder.svg` with the school's logo and update the logo path in `school.config.js` if the filename changes.
3. Add school documents to `docs/` using the placeholder filenames already referenced in `school.config.js`, or change each URL to match the uploaded filename.
4. Open `index.html` to preview the shell. For deployment, upload the folder to a static web host such as Vercel, Netlify, or the school division's web server.
5. Before real staff use, connect authentication, a database, secure file storage, and email notifications. The included announcement workflow uses browser `localStorage` for demonstration only and is not shared between devices.

## Document Checklist

Suggested files include:

- `weekly-staff-update.pdf`
- `bell-schedule.pdf`
- `duty-schedule.pdf`
- `staff-work-calendar.pdf`
- `school-map.pdf`
- `emergency-procedures.pdf`
- `phone-directory.pdf`
- `professional-leave-form.pdf`
- `field-trip-request.pdf`
- `fundraiser-request.pdf`
- `new-teacher-checklist.pdf`
- `lesson-plan-expectations.pdf`
- `substitute-plan-guide.pdf`
- `assessment-calendar.pdf`

Files do not have to use these names. Update the matching `url` in `school.config.js` when a filename differs.

## Production Safety

- Do not place passwords, private student information, medical information, or confidential crisis-plan details in this folder.
- Use a private staff sign-in before exposing internal resources.
- Store submissions and attachments in an authenticated database/storage service rather than `localStorage`.
- Limit approval and deletion rights to designated administrators.
- Confirm document-sharing permissions before publishing external Google Drive or Microsoft links.
