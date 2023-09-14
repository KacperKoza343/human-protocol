import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { FC } from 'react';

export const WarningIcon: FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M2.30353 19.2484C1.72458 20.2484 2.44617 21.5 3.60167 21.5H20.3983C21.5538 21.5 22.2754 20.2484 21.6965 19.2484L13.2981 4.74224C12.7204 3.74431 11.2796 3.74431 10.7019 4.74224L2.30353 19.2484ZM13 17.5C13 18.0523 12.5523 18.5 12 18.5C11.4477 18.5 11 18.0523 11 17.5C11 16.9477 11.4477 16.5 12 16.5C12.5523 16.5 13 16.9477 13 17.5ZM13 13.5C13 14.0523 12.5523 14.5 12 14.5C11.4477 14.5 11 14.0523 11 13.5V11.5C11 10.9477 11.4477 10.5 12 10.5C12.5523 10.5 13 10.9477 13 11.5V13.5Z"
        fill="#FF9800"
      />
    </SvgIcon>
  );
};