import { List as ListIcon, StackedLineChart as StackedLineChartIcon } from '@mui/icons-material'
import { Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system';
import React, { useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom';

const Menu = () => {
  const useRouteMatch = (patterns: readonly string[]) => {
    const { pathname } = useLocation();

    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }

    return null;
  }

  const routeMatch = useRouteMatch(['/history', '/statistics']);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'red', display: 'flex', height: 224 }}
    >
      <Tabs value={currentTab} orientation='vertical'>
        <Tab icon={<ListIcon />} iconPosition='start' value='/history' to='/history' component={Link} label="Historia" />
        <Tab icon={<StackedLineChartIcon />} iconPosition='start' value='/statistics' to='/statistics' component={Link} label="Statystyki" />
      </Tabs>
    </Box>
  )
}

export default Menu;