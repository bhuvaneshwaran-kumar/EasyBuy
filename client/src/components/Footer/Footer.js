import React from 'react'
import './Footer.css'

function Footer() {
    return (
        <div className="footer-container">
        <div className="section">
            <h3>ABOUT :</h3>
            <ul>
                <li>Contact Us</li>
                <li>About Us</li>
                <li>Careers</li>
                <li>EasyBuy Stories</li>
            </ul>
        </div>
        <div className="section">
            <h3>HELP :</h3>
            <ul>
                <li>Payments</li>
                <li>Shipping</li>
                <li>Cancellation & Returns</li>
                <li>FAQ</li>
                <li>Report Infringement</li>
            </ul>
        </div>
        <div className="section">
            <h3>POLICY :</h3>
           <ul>
           <li>Return Policy</li>
            <li>Terms of Use</li>
            <li>Security</li>
            <li>Privacy</li>
            <li>Sitemap</li>
            <li>EPR Compliance</li>
           </ul>
        </div>
        <div className="section">
            <h3>SOCIAL :</h3>
            <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>YouTube</li>
            </ul>
           
        </div>
       
        
    </div>
    )
}

export default Footer
