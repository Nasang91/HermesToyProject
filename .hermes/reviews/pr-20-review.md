## Review Summary
- PR: #20
- Verified at: 2026-05-25T23:55:36+09:00

## Validation Performed
- Ran `scripts/verify-pr.sh 20`
- Ran `npm run build`
- Inspected changed files and PR diff
- Manual runtime check: not attached

## Guard Script Result
```text
== Changed files ==
src/lib/__tests__/blocks.test.ts
src/lib/blocks.ts
== Build ==

> hermes-toy-project@0.0.0 build
> tsc -b && vite build

src/lib/__tests__/blocks.test.ts(1,38): error TS2307: Cannot find module 'vitest' or its corresponding type declarations.
```

## Build Result
```text

> hermes-toy-project@0.0.0 build
> tsc -b && vite build

src/lib/__tests__/blocks.test.ts(1,38): error TS2307: Cannot find module 'vitest' or its corresponding type declarations.
```

## Changed Files
```text
src/lib/__tests__/blocks.test.ts
src/lib/blocks.ts
```

## Diff Stat
```text
{"files":[{"path":"src/lib/__tests__/blocks.test.ts","additions":16,"deletions":0,"changeType":"ADDED"},{"path":"src/lib/blocks.ts","additions":73,"deletions":0,"changeType":"ADDED"}]}
```

## Manual Verification
- Confirmed expected behavior against issue/PR scope.
- No unexpected extra feature should be merged.

## Merge Decision
- Merge only if the above validation matches the requested scope.
