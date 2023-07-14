import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import gsap from 'gsap';

import { ThemeSet, ColorSet } from '../functions/ThemeSet';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

// nav links
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function NavLink({ to, children, appColor, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link
      to={to}
      {...props}
      className={'nav-link' + (isActive ? ' active' : '')}
      style={{
        backgroundColor: isActive ? 'var(--text)' : 'var(--bg)',
        color: isActive ? 'var(--bg-' + appColor + ')' : 'var(--text-' + appColor + ')',
      }}
    >
      {children}
    </Link>
  );
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//
// NAV MENU
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Nav() {
  var defaultColor = 'pink';
  const nav = useRef();
  const navTL = useRef();
  const [navState, setNavState] = useState('closed');
  const [appColor, setAppColor] = useState(defaultColor);

  // UPDATE CSS VARS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // primary CSS var
  //---------------------------------------------------------------------
  const root = document.documentElement.style;
  function setCssVarColor(color) {
    root.setProperty('--text', 'var(--text-' + color + ')');
    root.setProperty('--bg', 'var(--bg-' + color + ')');
    root.setProperty('--accent', 'var(--' + color + '-accent)');
    root.setProperty('--blk', 'var(--' + color + '-blk)');
    setCssVarColorRGB();
  }

  // RGB CSS var
  //---------------------------------------------------------------------
  function splitRGB(type) {
    const style = getComputedStyle(document.documentElement);
    let textSlice = style.getPropertyValue('--' + type).slice(4, -1);

    return textSlice;
  }
  function setCssVarColorRGB() {
    root.setProperty('--text-rgb', splitRGB('text'));
    root.setProperty('--bg-rgb', splitRGB('bg'));
    root.setProperty('--accent-rgb', splitRGB('accent'));
    root.setProperty('--blk-rgb', splitRGB('blk'));
  }

  // set app color
  setCssVarColor(appColor);

  // NAV TOGGLES
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // change app color
  //---------------------------------------------------------------------
  function changeAppColor(e) {
    setAppColor(e.currentTarget.id);
  }

  // toggle nav menu state
  //---------------------------------------------------------------------
  function toggleNavMenu() {
    if (navState === 'closed') {
      setNavState('open');
    } else if (navState === 'open') {
      setNavState('closed');
    }
  }

  // watch nav status
  //---------------------------------------------------------------------
  useEffect(() => {
    // toggle the direction of timeline
    if (navState === 'open') {
      navTL.current.timeScale(1);
    } else if (navState === 'closed') {
      navTL.current.timeScale(2);
    }
    // state on page load?
    navTL.current.reversed(navState === 'closed');
  }, [navState]);

  // animate nav
  //---------------------------------------------------------------------
  useLayoutEffect(() => {
    const navCtx = gsap.context(() => {
      navTL.current = gsap
        .timeline({ reversed: true })
        .add(navOpenCtrlBar())
        .add(navOpenNavLinks(), '<');
    }, [nav]);

    return () => navCtx.revert();
  }, []);

  // build nav menu
  //---------------------------------------------------------------------
  return (
    <nav ref={nav}>
      <div className="nav-wrapper">
        <div className="nav-control-bar">
          <ThemeSet classNames={'theme-toggle'} />

          <div className="nav-control-spacer"></div>
          <button
            className="nav-toggle"
            onClick={toggleNavMenu}
            style={
              navState === 'open'
                ? { backgroundColor: 'var(--red-accent)', color: '#990d00' }
                : {
                    backgroundColor: 'var(--text-' + appColor + ')',
                    color: 'var(--bg-' + appColor + ')',
                  }
            }
          >
            <i className={'bi' + (navState === 'open' ? ' bi-x-lg ' : ' bi-list')}></i>
          </button>
        </div>

        <ColorSet currentAppColor={appColor} appColorTarget={changeAppColor} />

        {/*
        // NAV LINKS
        //---------------------------------------------------------------------
         */}
        <div className="nav-link-mask">
          <div className="nav-link-container" onClick={toggleNavMenu}>
            <NavLink to="/home" children="home" appColor={appColor} />
            <NavLink to="/work" children="work" appColor={appColor} />
            <NavLink to="/documentation" children="docs" appColor={appColor} />
            <NavLink to="/about" children="about" appColor={appColor} />
            <NavLink to="/contact" children="contact" appColor={appColor} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// ANIMATIONS
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function navOpenCtrlBar() {
  let openCtrlBarTL = gsap.timeline({
    defaults: { duration: 0.2, ease: 'power4.out' },
  });
  openCtrlBarTL

    .to('.nav-link-mask', { scaleX: 1 }, '<')
    .to(
      '.nav-control-bar',
      {
        borderRadius: '1.5rem 1.5rem 0rem 0rem',
        padding: '0.65rem',
      },
      '<'
    )
    .to('.nav-toggle', { borderRadius: '1rem' }, '<')
    .to('.theme-toggle', { borderRadius: '1rem' }, '<')
    .to(
      '.color-set-toggles-mask',
      {
        width: 'auto',
        height: 'auto',
      },
      '<'
    )
    .to(
      '.color-set-toggles-mask',
      {
        translateY: -1,
        delay: 0.1,
      },
      '<'
    )
    .to(
      '.color-set-toggle',
      {
        boxShadow: 'inset -2px 5px rgba(0, 0, 0, 0.35)',
        stagger: {
          amount: 0.4,
        },
        duration: 0.6,
      },
      '<'
    );

  return openCtrlBarTL;
}

function navOpenNavLinks() {
  let openNavLinksTL = gsap.timeline({
    defaults: { duration: 0.2, ease: 'power4.out' },
  });
  openNavLinksTL
    .to('.color-set-toggle', {
      scale: 1,
    })
    .to('.nav-link-container', { padding: '1rem', duration: 0 }, '<')
    .to('.nav-link-mask', { height: 'auto', scaleY: 1, translateY: -1 })
    .to('.nav-link', { translateY: 0 }, '<')
    .to('.nav-link', { scale: 1, duration: 0.5 }, '<');

  return openNavLinksTL;
}
