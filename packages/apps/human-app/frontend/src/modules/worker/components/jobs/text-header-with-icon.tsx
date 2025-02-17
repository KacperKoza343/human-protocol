import Grid from '@mui/material/Grid/Grid';
import { FiltersIcon } from '@/shared/components/ui/icons';

export type IconType = 'filter';

export function TextHeaderWithIcon({
  text,
  iconType,
}: {
  text: string;
  iconType: IconType;
}) {
  const getIcon = () => {
    switch (iconType) {
      case 'filter':
        return <FiltersIcon />;
    }
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{text}</span>
      {getIcon()}
    </Grid>
  );
}
