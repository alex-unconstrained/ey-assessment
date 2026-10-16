# Secret scan record: ey-assessment

| Field | Value |
|---|---|
| Repository | alex-unconstrained/ey-assessment (public) |
| Branch scanned | main |
| Commit SHA | e05a1dae968197ce09129bae2ae51b4c88329d8d (committed 2026-03-25T20:42:38-05:00) |
| Run identifier | 20261016T004037Z-e05a1da |
| Scan started / finished (UTC) | 2026-10-16T00:40:37Z / 2026-10-16T00:40:39Z |
| Tracked files scanned | 16 |
| Document generated (UTC) | 2026-10-16T00:51:22Z |
| Reviewer | Alex Johnson (prepared by automated scan, to be confirmed) |

## Tools and versions

- Local scan: detect-secrets 1.5.0 (Yelp; default plugins and filters, `scan --all-files`), run on a shallow clone (`--depth 1`) of the default branch. Scope is the tree at the commit above only; git history was NOT scanned. gitleaks and trufflehog were not installed.
- GitHub secret scanning (API `/secret-scanning/alerts`): enabled; 0 alerts (open+resolved). Push protection: enabled.
- GitHub Dependabot alerts: NOT ENABLED on this repository (API 403 "Dependabot alerts are disabled"); no dependency-vulnerability data exists for this repo. This is a coverage gap, not a clean result.

## Result

**CLEAN.** detect-secrets reported 0 findings for alex-unconstrained/ey-assessment at commit e05a1dae9681 (run 20261016T004037Z-e05a1da). Limitation: HEAD tree only, no history scan.

## Notes

- Committed to this repository at `/compliance/secret-scans/2026-10-16-ey-assessment-secretscan.md` on 2026-10-16 as evidence for SecComply gap G-05 (retained scan artefact).
- Dispositions are provisional until Alex Johnson confirms them. Status values: open, fixed, false positive.
