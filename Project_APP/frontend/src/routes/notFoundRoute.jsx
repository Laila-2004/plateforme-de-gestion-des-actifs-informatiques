import React from 'react';
import { Route } from 'react-router-dom';
import NotFound from '../pages/common/NotFound';

const NotFoundRoute = <Route key="not-found" path="*" element={<NotFound />} />;

export default NotFoundRoute;