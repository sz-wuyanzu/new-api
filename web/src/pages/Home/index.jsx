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

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='w-full overflow-x-hidden'>
          {/* Hero */}
          <div className='w-full min-h-[calc(100vh-64px)] flex flex-col items-center relative overflow-hidden px-6 pt-16 md:pt-24 pb-10'>

            {/* Top spacer — golden ratio positioning */}
            <div className='flex-1 min-h-[6vh]' />

            {/* Main content */}
            <div className='flex flex-col items-center text-center max-w-3xl mx-auto'>

              {/* Headline */}
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] ${isChinese ? 'tracking-wide' : 'tracking-tight'}`}
                style={{ color: 'var(--semi-color-text-0)' }}
              >
                {t('一个接口')}{isChinese ? '，' : '. '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t('驾驭所有 AI')}
                </span>
              </h1>

              {/* Key metrics — data speaks louder than words */}
              <div className='flex items-center gap-2 mt-6 md:mt-7 text-sm' style={{ color: 'var(--semi-color-text-2)' }}>
                <span className='font-medium' style={{ color: 'var(--semi-color-text-0)' }}>40+</span>
                <span className='opacity-60'>{t('模型')}</span>
                <span className='opacity-20 mx-1'>·</span>
                <span className='opacity-60'>{t('兼容 OpenAI 格式')}</span>
                <span className='opacity-20 mx-1'>·</span>
                <span className='opacity-60'>{t('一行代码接入')}</span>
              </div>

              {/* Base URL with label */}
              <div className='mt-8 w-full max-w-sm'>
                <p className='text-xs mb-2 tracking-wide uppercase opacity-40' style={{ color: 'var(--semi-color-text-2)' }}>
                  {t('替换你的 Base URL')}
                </p>
                <Input
                  readonly
                  value={serverAddress}
                  className='flex-1 !rounded-full'
                  size='default'
                  suffix={
                    <div className='flex items-center gap-2'>
                      <ScrollList
                        bodyHeight={28}
                        style={{ border: 'unset', boxShadow: 'unset' }}
                      >
                        <ScrollItem
                          mode='wheel'
                          cycled={true}
                          list={endpointItems}
                          selectedIndex={endpointIndex}
                          onSelect={({ index }) => setEndpointIndex(index)}
                        />
                      </ScrollList>
                      <Button
                        type='primary'
                        size='small'
                        onClick={handleCopyBaseURL}
                        icon={<IconCopy />}
                        className='!rounded-full'
                      />
                    </div>
                  }
                />
              </div>

              {/* CTA */}
              <div className='mt-7'>
                <Link to='/console'>
                  <button
                    className='group px-8 h-11 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]'
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span className='inline-flex items-center gap-1.5'>
                      {t('开始使用')}
                      <svg className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                      </svg>
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom spacer */}
            <div className='flex-[1.8] min-h-[6vh]' />

            {/* Trust bar — single clean row of top providers */}
            <div className='w-full max-w-lg mx-auto'>
              <div className='flex items-center justify-center gap-6 md:gap-7 opacity-35'>
                <OpenAI size={22} />
                <Claude.Color size={22} />
                <Gemini.Color size={22} />
                <DeepSeek.Color size={22} />
                <Qwen.Color size={22} />
                <XAI size={22} />
                <Zhipu.Color size={22} />
                <Midjourney size={22} />
                <Grok size={22} />
                <AzureAI.Color size={22} />
                <span className='text-xs opacity-60' style={{ color: 'var(--semi-color-text-2)' }}>
                  {t('等 40+ 家')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
