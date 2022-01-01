import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import DemoPageLinks from '../components/DemoPageLinks'


const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h3>Home</h3>
          <p>
            This page does not require authentication, so it won't redirect to
            the login page if you are not signed in.
          </p>
          <p>
            If you remove `getServerSideProps` from this page, it will be static
            and load the authed user only on the client side.
          </p>
          <a href="/todo" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add a todo!</a>
        </div>
        <DemoPageLinks />
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)
