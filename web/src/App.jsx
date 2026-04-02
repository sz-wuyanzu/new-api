/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { lazy, Suspense, useContext, useMemo } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import Loading from './components/common/ui/Loading';
import { AuthRedirect, PrivateRoute, AdminRoute } from './helpers';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import { StatusContext } from './context/Status';

import OAuth2Callback from './components/auth/OAuth2Callback';
import SetupCheck from './components/layout/SetupCheck';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const About = lazy(() => import('./pages/About'));
const UserAgreement = lazy(() => import('./pages/UserAgreement'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const User = lazy(() => import('./pages/User'));
const Setting = lazy(() => import('./pages/Setting'));
const Channel = lazy(() => import('./pages/Channel'));
const Token = lazy(() => import('./pages/Token'));
const Redemption = lazy(() => import('./pages/Redemption'));
const TopUp = lazy(() => import('./pages/TopUp'));
const Log = lazy(() => import('./pages/Log'));
const Chat = lazy(() => import('./pages/Chat'));
const Chat2Link = lazy(() => import('./pages/Chat2Link'));
const Midjourney = lazy(() => import('./pages/Midjourney'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Task = lazy(() => import('./pages/Task'));
const ModelPage = lazy(() => import('./pages/Model'));
const ModelDeploymentPage = lazy(() => import('./pages/ModelDeployment'));
const Playground = lazy(() => import('./pages/Playground'));
const Subscription = lazy(() => import('./pages/Subscription'));
const PersonalSetting = lazy(() => import('./components/settings/PersonalSetting'));
const Setup = lazy(() => import('./pages/Setup'));
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const PasswordResetForm = lazy(() => import('./components/auth/PasswordResetForm'));
const PasswordResetConfirm = lazy(() => import('./components/auth/PasswordResetConfirm'));

function DynamicOAuth2Callback() {
  const { provider } = useParams();
  return <OAuth2Callback type={provider} />;
}

function App() {
  const [statusState] = useContext(StatusContext);

  // 获取模型广场权限配置
  const pricingRequireAuth = useMemo(() => {
    const headerNavModulesConfig = statusState?.status?.HeaderNavModules;
    if (headerNavModulesConfig) {
      try {
        const modules = JSON.parse(headerNavModulesConfig);

        // 处理向后兼容性：如果pricing是boolean，默认不需要登录
        if (typeof modules.pricing === 'boolean') {
          return false; // 默认不需要登录鉴权
        }

        // 如果是对象格式，使用requireAuth配置
        return modules.pricing?.requireAuth === true;
      } catch (error) {
        console.error('解析顶栏模块配置失败:', error);
        return false; // 默认不需要登录
      }
    }
    return false; // 默认不需要登录
  }, [statusState?.status?.HeaderNavModules]);

  return (
    <SetupCheck>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/setup' element={<Setup />} />
          <Route path='/forbidden' element={<Forbidden />} />
          <Route
            path='/console/models'
            element={<AdminRoute><ModelPage /></AdminRoute>}
          />
          <Route
            path='/console/deployment'
            element={<AdminRoute><ModelDeploymentPage /></AdminRoute>}
          />
          <Route
            path='/console/subscription'
            element={<AdminRoute><Subscription /></AdminRoute>}
          />
          <Route
            path='/console/channel'
            element={<AdminRoute><Channel /></AdminRoute>}
          />
          <Route
            path='/console/token'
            element={<PrivateRoute><Token /></PrivateRoute>}
          />
          <Route
            path='/console/playground'
            element={<PrivateRoute><Playground /></PrivateRoute>}
          />
          <Route
            path='/console/redemption'
            element={<AdminRoute><Redemption /></AdminRoute>}
          />
          <Route
            path='/console/user'
            element={<AdminRoute><User /></AdminRoute>}
          />
          <Route path='/user/reset' element={<PasswordResetConfirm />} />
          <Route
            path='/login'
            element={<AuthRedirect><LoginForm /></AuthRedirect>}
          />
          <Route
            path='/register'
            element={<AuthRedirect><RegisterForm /></AuthRedirect>}
          />
          <Route path='/reset' element={<PasswordResetForm />} />
          <Route path='/oauth/github' element={<OAuth2Callback type='github' />} />
          <Route path='/oauth/discord' element={<OAuth2Callback type='discord' />} />
          <Route path='/oauth/oidc' element={<OAuth2Callback type='oidc' />} />
          <Route path='/oauth/linuxdo' element={<OAuth2Callback type='linuxdo' />} />
          <Route path='/oauth/:provider' element={<DynamicOAuth2Callback />} />
          <Route
            path='/console/setting'
            element={<AdminRoute><Setting /></AdminRoute>}
          />
          <Route
            path='/console/personal'
            element={<PrivateRoute><PersonalSetting /></PrivateRoute>}
          />
          <Route
            path='/console/topup'
            element={<PrivateRoute><TopUp /></PrivateRoute>}
          />
          <Route
            path='/console/log'
            element={<PrivateRoute><Log /></PrivateRoute>}
          />
          <Route
            path='/console'
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path='/console/midjourney'
            element={<PrivateRoute><Midjourney /></PrivateRoute>}
          />
          <Route
            path='/console/task'
            element={<PrivateRoute><Task /></PrivateRoute>}
          />
          <Route
            path='/pricing'
            element={
              pricingRequireAuth
                ? <PrivateRoute><Pricing /></PrivateRoute>
                : <Pricing />
            }
          />
          <Route path='/about' element={<About />} />
          <Route path='/user-agreement' element={<UserAgreement />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/console/chat/:id?' element={<Chat />} />
          <Route
            path='/chat2link'
            element={<PrivateRoute><Chat2Link /></PrivateRoute>}
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </SetupCheck>
  );
}

export default App;
