import CloseIcon from '@mui/icons-material/Close';
import type { CustomButtonProps } from '@/shared/components/ui/button';
import { TableButton } from '@/shared/components/ui/table-button';

export function RejectButton(props: CustomButtonProps) {
  return (
    <TableButton
      {...props}
      sx={{
        padding: '0.4rem',
        minWidth: 'unset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.sx,
      }}
    >
      <CloseIcon
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </TableButton>
  );
}
