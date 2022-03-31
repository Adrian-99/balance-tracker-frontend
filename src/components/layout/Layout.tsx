import React from 'react'
import Navbar from './Navbar'

interface IProps {}

const Layout: React.FC<IProps> = ({children}) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Layout