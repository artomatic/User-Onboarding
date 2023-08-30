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

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

const formSchema = Yup.object().shape ( {
  username: Yup
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: Yup
    .required(e.favLanguageRequired)
    .oneOf( ['javascript', 'rust'], e.favLanguageOptions),
  agreement: Yup
    .required(e.agreementRequired)
    .oneOf( [true], e.agreementOptions)

})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server
  // and (5) the failure message from the server.

  const [formState, setFormState] = useState ({username: '', favLanguage: '', favFood: '', agreement: ''})

  const [errors, setErrors] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: ''
  })

  const [submitDisabled, setSubmitDisabled] = useState(true)

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema,
  // and update the state that tracks whether the form is submittable.


  useEffect( () => {
    formSchema.isValid(formState).then (valid => {
      setSubmitDisabled(!valid)
    })
  }, [formState])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox", and act accordingly.
    // At every change, the updated value must be validated, and the validation
    // error must be put in the state where we track front-end validation errors.

    console.log(evt)
    const targetValue = evt.target.type === 'checkbox'? evt.target.checked : evt.target.value
    setFormState ( {...formState, [evt.target.name]: targetValue})
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, POST the form data to the endpoint. On success, reset
    // the form. The success and failure messages from the server must be put
    // in the states you have reserved for them, and the form
    // should be re-enabled.

    evt.preventDefault()
    const newData = { username: formState.username, favLanguage: formState.favLanguage, favFood: formState.favFood, agreement:formState.agreement}
    submitDisabled? axios.post('https://webapis.bloomtechdev.com/registration', newData)
    .then (res => {
      console.log(res)
      setFormState({username: '', favLanguage: '', favFood: '', agreement: ''})
    })
    .catch (err => console.log('failed to send post request'))
    : {}
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form>
        <h4 className="success">Success! Welcome, new user!</h4>
        <h4 className="error">Sorry! Username is taken</h4>

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" onChange={onChange}/>
          <div className="validation">username is required</div>
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
          <div className="validation" onChange={onChange}>favLanguage is required</div>
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          <div className="validation">favFood is required</div>
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange}/>
            Agree to our terms
          </label>
          <div className="validation">agreement is required</div>
        </div>

        <div>
          <input type="submit" disabled={false} onChange={onChange}/>
        </div>
      </form>
    </div>
  )
}
