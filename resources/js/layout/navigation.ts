import { useTranslation } from 'react-i18next';
import { PATHS } from '../routes/paths';
import { Building2, FileText, LayoutDashboard, ListCollapse, ListTree, Package, Plus, Receipt, Settings, Users } from 'lucide-react';

export const useNavigationRoutes = () => {
  const { t } = useTranslation('navigation');

  return [
    {
      path: PATHS.INDEX,
      label: t('menu.dashboard'),
      icon: LayoutDashboard,
    },
    {
      path: PATHS.DASHBOARD,
      label: t('menu.newArrival'),
      icon: Plus,
    },
  ];
};