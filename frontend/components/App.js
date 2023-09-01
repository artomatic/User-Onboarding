// ❗ The ✨ TASKS found inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const formSchema = Yup.object().shape ( {
  username: Yup
    .string()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: Yup
    .string()
    .required(e.favLanguageRequired)
    .oneOf( ['javascript', 'rust'], e.favLanguageOptions),
  favFood: Yup
    .string()
    .required(e.favFoodRequired)
    .oneOf( ['pizza', 'spaghetti', 'broccoli'], e.favFoodOptions),
  agreement: Yup
    .boolean()
    .required(e.agreementRequired)
    .oneOf( [true], e.agreementOptions)
})

export default function App() {

  const getInitialErrors = () => ({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: ''
  })

  const getInitialForm = () => (
    {username: '', 
    favLanguage: '', 
    favFood: '', 
    agreement: false})

  const [formState, setFormState] = useState (getInitialForm)
  const [errors, setErrors] = useState(getInitialErrors)
  const [disabled, setDisabled] = useState(true)
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()

  useEffect( () => {
    formSchema.isValid(formState).then (valid => {
      setDisabled(!valid)

    })
  }, [formState])

  const onChange = evt => {

    let {name, type, value, checked} = evt.target
    value = type === 'checkbox'? checked : value
    setFormState ( {...formState, [name]: value})

    Yup.reach(formSchema, name).validate(value)
      .then ( () => setErrors({...errors, [name]: ''}))
      .catch ( (err) => setErrors( {...errors, [name]: err.errors[0]}))
  }



  const submit = evt => {

    evt.preventDefault()
    const newData = { 
      username: formState.username, 
      favLanguage: formState.favLanguage, 
      favFood: formState.favFood, 
      agreement:formState.agreement}

    axios.post('https://webapis.bloomtechdev.com/registration', newData)
    .then (res => {
      console.log(res)
      setSuccessMessage(res.data.messsage)
      setFailMessage()
      setFormState({username: '', favLanguage: '', favFood: '', agreement: ''})
    })
    .catch (err => {
      setFailMessage(err.response.data.message)
      setSuccessMessage()
    })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={submit}>
        {successMessage && <h4 className="success">Success! Welcome, new user!</h4>}
        {failMessage && <h4 className="error">Sorry! Username is taken</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" onChange={onChange}/>
          {errors.username && <div className="validation">username is required</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange}/>
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange}/>
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">favLanguage is required</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <div className="validation">favFood is required</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange}/>
            Agree to our terms
          </label>
          {errors.agreement && <div className="validation">agreement is required</div>}
        </div>

        <div>
          <input type="submit" disabled={disabled}/>
        </div>
      </form>
    </div>
  )
}
