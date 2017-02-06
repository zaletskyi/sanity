import React, {PropTypes} from 'react'

function Paragraph(props) {
  return <p className={styles.root}>{props.children}</p>
}

Paragraph.propTypes = {
  children: PropTypes.node
}

export default Paragraph
