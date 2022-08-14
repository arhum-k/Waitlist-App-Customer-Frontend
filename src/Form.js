import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './Form.css'

var API_URL="https://vast-depths-43868.herokuapp.com"
//var API_URL="http://localhost:7004"

function Form() {

    const [showSuccess,setShowSuccess] =React.useState(false)

    const [formData,setFormData] = useState({
        fullName: "",
        numPeople: "1",
        phoneNum: ""

    })


    function handleEvent(event){
        /* let name, value
        console.log(val)
        if(bool){
            name=event
            value= val
            
        }else{
            name=event.target.name
            value=event.target.value
        } */
        
        const { name, value }= event.target
        
        setFormData(() => ({
            ...formData,
            [name]: value
        }))
        
    }

    function handlePhone(event){
        //console.log(event)
        setFormData((prevForm)=>({
             ...prevForm,
                phoneNum:event
        }))
    }
    
    //console.log(formData)


    async function postInfoToBack(e){
        setShowSuccess(true)
        e.preventDefault()
        const res = await fetch(API_URL+"/",
        {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(formData)
        })
    }



  return (
    <>
    <h4 className="header">Enter your information:</h4>
    <form onSubmit={postInfoToBack} >
        <label>Full Name 
        <input
            className='inputs'             
            onChange={handleEvent}
            name="fullName"
            id="fullName"
            value={formData.fullName}
        ></input></label>
        <br/>

        <label>Phone Number
        <PhoneInput
            className="phoneNum"
            country={'us'}
            placeholder="Enter phone number"
            value={formData.phoneNum}
             onChange={handlePhone}         
        /></label>
        <label>Number of People <br/>
        <select name="numPeople" className='select' onChange={handleEvent}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6+</option>
        </select></label>
        <br/>
        <button className="buttons">Join Waitlist</button>
        <br/>
        <br/>
        <label className="success" style={{ display: showSuccess ? "block" : "none" }}> 
            <h4>🍽️ You have been added to the waitlist! 🍽️</h4>
        </label>
    </form>
    </>
  )
}

export default Form