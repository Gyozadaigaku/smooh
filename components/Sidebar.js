import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  container: {
    maxWidth: 350,
    width: '100%',
  },
  versionsContainer: {
    marginLeft: 0,
    marginRight: 'auto',
  },
  button: {
    marginLeft: 16,
    cursor: 'pointer',
  },
}

const Sidebar = props => {
  return (
    <>
      <aside style={styles.container}>
        Sidebar
      </aside>
    </>
  )
}


export default Sidebar
