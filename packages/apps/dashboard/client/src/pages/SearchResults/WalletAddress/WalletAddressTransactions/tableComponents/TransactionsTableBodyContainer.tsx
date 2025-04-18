import MuiTableBody from '@mui/material/TableBody';
import { Grid } from '@mui/material';

export const TransactionsTableBodyContainer = ({
  children,
}: {
  children: JSX.Element;
}) => {
  return (
    <MuiTableBody sx={{ position: 'relative', height: ' 40vh' }}>
      <Grid
        component="tr"
        container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <td>{children}</td>
      </Grid>
    </MuiTableBody>
  );
};
