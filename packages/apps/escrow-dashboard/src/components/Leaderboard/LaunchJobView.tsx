import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  FormControl as MuiFormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardContainer } from '../Cards';
import {
  ImageLabelingIcon,
  MarketMakingIcon,
  OpenQueriesIcon,
  TextLabelingIcon,
} from '../Icons';
import { ViewTitle } from '../ViewTitle';
import launchTaskImg from 'src/assets/leaderboard/launch-task.png';
import {
  ImageLabelingJobType,
  ImageLabelingJobTypeLabels,
  MarketMakingJobType,
  MarketMakingJobTypeLabels,
  OpenQueriesJobType,
  OpenQueriesJobTypeLabels,
  TextLabelingJobType,
  TextLabelingJobTypeLabels,
} from 'src/constants/leaderboard';

const SelectContainer = styled(Box)({
  borderRadius: '10px',
  background: 'rgba(20, 6, 178, 0.04)',
  padding: '22px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
});

const SelectIcon = styled(Box)({
  width: '82px',
  height: '82px',
  background: 'rgba(20, 6, 178, 0.04)',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const FormControl = styled(MuiFormControl)({
  '& .MuiInput-root::before': {
    content: 'none',
  },
  '& .MuiInput-root::after': {
    content: 'none',
  },
  '& .MuiSelect-select': {
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '32px',
  },
  '& .MuiSelect-icon': {
    color: '#6309FF',
    fontSize: '2rem',
  },
});

const JobTypeSelect = ({
  values,
  labelMap,
  placeholder,
  icon: IconComponent,
  selectedValue,
  onChange,
}: any) => {
  return (
    <SelectContainer>
      <SelectIcon>{IconComponent}</SelectIcon>
      <FormControl variant="standard" sx={{ flex: 1 }}>
        <Select
          displayEmpty
          renderValue={(selected: any) => labelMap[selected] ?? placeholder}
          value={selectedValue as any}
          onChange={onChange}
        >
          {values.map((jobType: any) => (
            <MenuItem key={jobType} value={jobType}>
              {labelMap[jobType]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </SelectContainer>
  );
};

export const LaunchJobView = () => {
  const [selectedJobType, setSelectedJobType] = useState('');

  return (
    <Box mt={10}>
      <ViewTitle title="Launch job" iconUrl={launchTaskImg} fontSize={50} />
      <CardContainer sxProps={{ mt: '52px' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography color="primary" variant="h4" fontWeight={600} mb={2}>
              Select your job type
            </Typography>
            <Typography variant="h6" fontWeight={500} color="#5E69A6">
              Choose your data annotation task type from the types available
              below
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(2, 136, 209, 0.04)',
              borderRadius: '4px',
              padding: '6px 16px',
            }}
          >
            <InfoIcon htmlColor="#858EC6" />
            <Typography variant="body2" color="#013654" sx={{ ml: '12px' }}>
              Unsure what job type to choose?
            </Typography>
            <Link to="/leaderboard-all-job-types">
              <Button
                sx={{ ml: 2 }}
                color="secondary"
                endIcon={<ArrowForwardIcon />}
              >
                Explore jobs
              </Button>
            </Link>
          </Box>
        </Box>
        <Box maxWidth="984px" mx="auto" p={4} mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6}>
              <JobTypeSelect
                values={Object.values(TextLabelingJobType)}
                labelMap={TextLabelingJobTypeLabels}
                icon={<TextLabelingIcon />}
                placeholder="Text labeling"
                selectedValue={selectedJobType}
                onChange={(e: any) => setSelectedJobType(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <JobTypeSelect
                values={Object.values(ImageLabelingJobType)}
                labelMap={ImageLabelingJobTypeLabels}
                icon={<ImageLabelingIcon />}
                placeholder="Image labeling"
                selectedValue={selectedJobType}
                onChange={(e: any) => setSelectedJobType(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <JobTypeSelect
                values={Object.values(MarketMakingJobType)}
                labelMap={MarketMakingJobTypeLabels}
                icon={<MarketMakingIcon />}
                placeholder="Market Making"
                selectedValue={selectedJobType}
                onChange={(e: any) => setSelectedJobType(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <JobTypeSelect
                values={Object.values(OpenQueriesJobType)}
                labelMap={OpenQueriesJobTypeLabels}
                icon={<OpenQueriesIcon />}
                placeholder="Open Queries"
                selectedValue={selectedJobType}
                onChange={(e: any) => setSelectedJobType(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          mt="44px"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Button
            color="secondary"
            variant="contained"
            size="large"
            sx={{ width: '452px' }}
          >
            Launch
          </Button>
          <Typography
            fontSize="13px"
            marginTop="10px"
            color="primary"
            sx={{ background: 'rgba(2, 136, 209, 0.04)' }}
          >
            Get started and launch tasks with newbie{' '}
            <Typography fontSize="13px" component="span" color="secondary">
              budget for free
            </Typography>
          </Typography>
        </Box>
      </CardContainer>
    </Box>
  );
};