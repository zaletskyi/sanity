import PropTypes from 'prop-types'
import React from 'react'
import Ink from 'react-ink'
import {Tooltip} from 'react-tippy'
import PlusIcon from 'part:@sanity/base/plus-icon'
import HamburgerIcon from 'part:@sanity/base/hamburger-icon'
import SearchIcon from 'part:@sanity/base/search-icon'
import LoginStatus from './LoginStatus'

import styles from './styles/NavBar.css'

function NavBar(props) {
  const {
    branding,
    onCreateButtonClick,
    onToggleMenu,
    onUserLogout,
    onSearchOpen,
    onSetLoginStatusElement,
    onSetRootElement,
    search,
    searchIsOpen,
    showToolSwitcher,
    toolBar,
    user
  } = props
  let searchClassName = styles.search
  if (searchIsOpen) searchClassName += ` ${styles.searchIsOpen}`
  let className = styles.root
  if (showToolSwitcher) className += ` ${styles.withToolSwitcher}`
  return (
    <div className={className} data-search-open={searchIsOpen} ref={onSetRootElement}>
      <div className={styles.hamburger}>
        <button
          className={styles.hamburgerButton}
          type="button"
          title="Menu"
          onClick={onToggleMenu}
        >
          <HamburgerIcon />
        </button>
      </div>
      <div className={styles.branding}>{branding}</div>
      <a className={styles.createButton} onClick={onCreateButtonClick}>
        <Tooltip
          title="Create new document"
          className={styles.createButtonIcon}
          theme="dark"
          size="small"
          distance="18"
          arrow
        >
          <PlusIcon />
          <span className={styles.createButtonText}>New</span>
          <Ink duration={200} opacity={0.1} radius={200} />
        </Tooltip>
      </a>
      <div className={styles.toolSwitcher}>{toolBar}</div>
      <div className={searchClassName}>
        <div>{search}</div>
      </div>
      <div className={styles.extras}>{/* Insert plugins here */}</div>
      <div className={styles.loginStatus}>
        <LoginStatus onLogout={onUserLogout} onSetElement={onSetLoginStatusElement} user={user} />
      </div>
      <a className={styles.searchButton} onClick={onSearchOpen}>
        <span className={styles.searchButtonIcon}>
          <SearchIcon />
        </span>
        <span className={styles.searchButtonText}>Search</span>
        <Ink duration={200} opacity={0.1} radius={200} />
      </a>
    </div>
  )
}

NavBar.defaultProps = {
  branding: undefined,
  onSetLoginStatusElement: undefined,
  onSetRootElement: () => null,
  showLabel: false,
  showToolSwitcher: false
}

NavBar.propTypes = {
  branding: PropTypes.element,
  onCreateButtonClick: PropTypes.func.isRequired,
  onToggleMenu: PropTypes.func.isRequired,
  onUserLogout: PropTypes.func.isRequired,
  onSearchOpen: PropTypes.func.isRequired,
  onSetRootElement: PropTypes.func,
  onSetLoginStatusElement: PropTypes.func,
  search: PropTypes.element.isRequired,
  searchIsOpen: PropTypes.bool.isRequired,
  toolBar: PropTypes.element.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    profileImage: PropTypes.string
  }).isRequired,
  showLabel: PropTypes.bool,
  showToolSwitcher: PropTypes.bool
}

export default NavBar
