import React, {PropTypes} from 'react'

function Header(props) {
  return (
    <div className={styles[`heading${props.level}`]}>
      {props.children}
    </div>
  )
}

Header.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node
}

export default Header
