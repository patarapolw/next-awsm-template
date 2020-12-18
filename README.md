Almost classless Next.js template (with TypeScript, ESLint, Prettier) powered by awsm.css

Tested with Yarn and Node.js 12.

## Needed files

You will need these files and folders, either at `./content/` or `../../`

```sh
_post/      # => will be parsed to /build/db.loki and /build/idx.json
_media/     # => will be copied to /public/media/
theme.yml   # => will be parsed to /build/theme.json
```

The structure of `theme.yml` can be seen at [/server/theme.ts](/server/theme.ts).

Markdown files should be put `_post/`, with YAML frontmatter required keys - `title`. `date` < NOW is required to be "visible" in the listing (at `${baseUrl}/blog`, `${baseUrl}/tag`). For more information, please see [/server/db.ts](/server/db.ts).

## Features

- Search engine with `lunr.js`
- Commenting engine with `remark42`
- Analytics with `plausible analytics`
