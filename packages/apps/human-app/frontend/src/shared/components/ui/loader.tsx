import type { CircularProgressProps } from '@mui/material/CircularProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { useColorMode } from '@/shared/contexts/color-mode';

export function Loader({ ...props }: CircularProgressProps) {
  const { colorPalette } = useColorMode();

  return (
    <CircularProgress
      {...props}
      sx={{
        '.MuiCircularProgress-circle': {
          color: colorPalette.primary.main,
        },
      }}
    />
  );
}
