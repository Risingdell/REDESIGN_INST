import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RouteError } from '@/pages/RouteError';

// Old kanachurims.com URLs → new pages, so bookmarks and search results keep working.
// (Server-side 301s are still recommended for SEO — see docs/ARCHITECTURE.md.)
const legacyRedirects = {
  'index.php': '/',
  'about.php': '/about',
  'founder_details.php': '/about#leadership',
  'corecomm.php': '/about#leadership',
  'awards_and_recognization.php': '/news',
  'mission.php': '/about#mission',
  'contactUs.php': '/contact',
  'contact.html': '/contact',
  'news1.php': '/news',
  'news.php': '/news',
  'events.php': '/news',
  'gallery.php': '/campus-life',
  'gazette.php': '/news',
  'departments.php': '/hospital#departments',
  'services3.php': '/hospital',
  'admissionEnquiry.php': '/admissions',
  'facilitiess.php': '/campus-life',
  'infrastructure1.php': '/campus-life',
};

// Each page is its own chunk; only the visited page's code is downloaded.
const page = (loader) => {
  const Component = lazy(loader);
  return <Component />;
};

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: page(() => import('@/pages/HomePage')) },
        { path: 'admissions', element: page(() => import('@/pages/AdmissionsPage')) },
        { path: 'admissions/apply', element: page(() => import('@/pages/ApplyPage')) },
        { path: 'programs', element: page(() => import('@/pages/ProgramsPage')) },
        { path: 'programs/:slug', element: page(() => import('@/pages/ProgramDetailPage')) },
        { path: 'institutions', element: page(() => import('@/pages/InstitutionsPage')) },
        { path: 'institutions/:slug', element: page(() => import('@/pages/InstitutionDetailPage')) },
        { path: 'hospital', element: page(() => import('@/pages/HospitalPage')) },
        { path: 'campus-life', element: page(() => import('@/pages/CampusLifePage')) },
        { path: 'news', element: page(() => import('@/pages/NewsPage')) },
        { path: 'news/:slug', element: page(() => import('@/pages/NewsDetailPage')) },
        { path: 'about', element: page(() => import('@/pages/AboutPage')) },
        { path: 'contact', element: page(() => import('@/pages/ContactPage')) },
        { path: 'students', element: page(() => import('@/pages/StudentsPage')) },
        { path: 'alumni', element: page(() => import('@/pages/AlumniPage')) },
        ...Object.entries(legacyRedirects).map(([from, to]) => ({ path: from, element: <Navigate to={to} replace /> })),
        { path: '*', element: page(() => import('@/pages/NotFoundPage')) },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
