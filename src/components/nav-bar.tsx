"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function NavBar() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [prevActiveIndex, setPrevActiveIndex] = useState(-1);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = useRef<(HTMLLIElement | null)[]>([]);
  
  const navItems = [
    { href: "/", label: "首页" },
    { href: "/music", label: "音乐作品" },
    { href: "/tour", label: "巡演信息" },
    { href: "/news", label: "新闻动态" },
    { href: "/admin", label: "管理" },
  ];

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.href === pathname);
    if (currentIndex !== -1) {
      setPrevActiveIndex(activeIndex);
      setActiveIndex(currentIndex);
    }
  }, [pathname, activeIndex]);

  useEffect(() => {
    const activeElement = navRefs.current[activeIndex];
    if (activeElement) {
      // 如果是初始加载，直接设置位置
      if (prevActiveIndex === -1) {
        const { offsetLeft, offsetWidth } = activeElement;
        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
          transition: 'none'
        });
        
        // 添加一个小延迟后恢复过渡效果
        setTimeout(() => {
          setIndicatorStyle(prev => ({
            ...prev,
            transition: 'all 700ms ease-in-out'
          }));
        }, 50);
      } else {
        // 正常过渡
        const { offsetLeft, offsetWidth } = activeElement;
        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
          transition: 'all 700ms ease-in-out'
        });
      }
    }
  }, [activeIndex, prevActiveIndex]);

  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">房东的猫</h1>
        <div className="relative">
          <ul className="flex space-x-8">
            {navItems.map((item:any, index) => (
              <li 
                key={item.href}
                ref={(el: HTMLLIElement | null) => {
                  navRefs.current[index] = el;
                }}
                className="relative"
              >
                <Link 
                  href={item.href} 
                  className={`py-1 block transition-all duration-500 ease-out transform-gpu ${
                    pathname === item.href 
                      ? 'text-blue-600 font-medium scale-110 origin-center' 
                      : 'hover:text-blue-600 hover:scale-105 origin-center'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <span 
            className="absolute bottom-0 h-0.5 bg-blue-600"
            style={indicatorStyle}
          />
        </div>
      </div>
    </nav>
  );
}