import { Skeleton, Stack } from "@mui/material";

interface LoadingSkeletonProps {
  readonly rows?: number;
}

export function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={42} />
      ))}
    </Stack>
  );
}
