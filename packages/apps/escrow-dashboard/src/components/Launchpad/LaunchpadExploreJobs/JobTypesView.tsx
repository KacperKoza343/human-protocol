import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Box,
  Card,
  CardMedia,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import tasksSvg from 'src/assets/tasks.svg';
import { ViewTitle } from 'src/components/ViewTitle';
import {
  ImageLabelingJobType,
  ImageLabelingJobTypeData,
  MarketMakingJobType,
  MarketMakingJobTypeData,
  OpenQueriesJobType,
  OpenQueriesJobTypeData,
  TextLabelingJobType,
  TextLabelingJobTypeData,
} from 'src/constants/launchpad';

const JobTypeList = ({
  label,
  values,
  labelMap,
  open,
  selected,
  onClick,
}: any) => {
  return (
    <>
      <ListItemButton onClick={onClick} selected={selected}>
        <ListItemText>
          <Typography variant="body1" color="primary" fontWeight={500}>
            {label}
          </Typography>
        </ListItemText>
        {open ? (
          <ArrowDropUpIcon color="primary" />
        ) : (
          <ArrowDropDownIcon color="primary" />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {values.map((jobType: any) => (
            <ListItemButton key={jobType} sx={{ pl: 4 }}>
              <Typography variant="body1" color="#5E69A6">
                {labelMap[jobType].label}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export const JobTypeCard = ({
  image,
  label,
  description,
}: {
  image?: string;
  label?: string;
  description?: string;
}) => {
  return (
    <Card
      sx={{
        boxShadow:
          '0px 1px 5px 0px rgba(233, 235, 250, 0.20), 0px 2px 2px 0px rgba(233, 235, 250, 0.50), 0px 3px 1px -2px #E9EBFA',
        borderRadius: '16px',
        width: '396px',
      }}
    >
      <Box sx={{ padding: 2 }}>
        <CardMedia
          sx={{ height: 200, borderRadius: '8px' }}
          image={image}
          title={label}
        />
        <Box sx={{ mt: 3, pt: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight={500}
          >
            {label}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            lineHeight={1.5}
            mb={2}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

enum JobTypeFilter {
  TextLabeling = 'Text Labeling',
  ImageLabeling = 'Image Labeling',
  MarketMaking = 'Market Making',
  OpenQueries = 'Open Queries',
}

const defaultFilterKeys = [
  JobTypeFilter.TextLabeling,
  JobTypeFilter.ImageLabeling,
  JobTypeFilter.MarketMaking,
  JobTypeFilter.OpenQueries,
];

const FilterData = [
  {
    filterKey: JobTypeFilter.TextLabeling,
    values: Object.values(TextLabelingJobType),
    labelMap: TextLabelingJobTypeData,
  },
  {
    filterKey: JobTypeFilter.ImageLabeling,
    values: Object.values(ImageLabelingJobType),
    labelMap: ImageLabelingJobTypeData,
  },
  {
    filterKey: JobTypeFilter.MarketMaking,
    values: Object.values(MarketMakingJobType),
    labelMap: MarketMakingJobTypeData,
  },
  {
    filterKey: JobTypeFilter.OpenQueries,
    values: Object.values(OpenQueriesJobType),
    labelMap: OpenQueriesJobTypeData,
  },
];

export const JobTypesView = () => {
  const [selectedFilterKeys, setSelectedFilterKeys] =
    useState<JobTypeFilter[]>(defaultFilterKeys);

  const filteredMapData = useMemo(() => {
    if (selectedFilterKeys.length === 4) {
      return FilterData.map(({ labelMap }) => labelMap);
    }
    return FilterData.filter(({ filterKey }) =>
      selectedFilterKeys.includes(filterKey)
    ).map(({ labelMap }) => labelMap);
  }, [selectedFilterKeys]);

  return (
    <Box mt="58px">
      <ViewTitle title="Job types" iconUrl={tasksSvg} fontSize={45} />
      <Box sx={{ mt: '54px', display: 'flex' }}>
        <List
          sx={{ width: '100%', maxWidth: 240, marginRight: '52px' }}
          component="nav"
        >
          <ListItemButton
            onClick={() => setSelectedFilterKeys(defaultFilterKeys)}
            selected={selectedFilterKeys.length === 4}
          >
            <Typography variant="body1" color="primary" fontWeight={500}>
              All
            </Typography>
          </ListItemButton>
          {FilterData.map(({ filterKey, values, labelMap }) => (
            <JobTypeList
              key={filterKey}
              label={filterKey}
              values={values}
              labelMap={labelMap}
              open={selectedFilterKeys.includes(filterKey)}
              onClick={() =>
                selectedFilterKeys.includes(filterKey)
                  ? setSelectedFilterKeys(
                      selectedFilterKeys.filter((key) => key !== filterKey)
                    )
                  : setSelectedFilterKeys([...selectedFilterKeys, filterKey])
              }
            />
          ))}
        </List>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {filteredMapData
            .flatMap((d) => Object.values(d))
            .map(({ label, description, image }, i) => (
              <JobTypeCard
                key={i}
                label={label}
                description={description}
                image={image}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};
