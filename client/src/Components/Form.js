import React from 'react';

// The Form component exports a function that renders any 
// validation errors sent from the API, via the <ErrorsDisplay> function component. 
// It also renders the "Submit" and "Cancel" buttons of a form, 
// as well as handle their functionality, via the functions handleSubmit and handleCancel. 
// Props are passed to this component – from a parent component like UserSignUp – 
// to provide it the data it needs.

export default (props) => {
  const {
    cancel,
    errors,
    submit,
    formButtonsClass,
    submitButtonText,
    submitButtonClass,
    cancelButtonClass,
    elements,
  } = props;

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  return (
    <div className="form-container">
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        { elements() }
        <div className={formButtonsClass}>
          <button className={submitButtonClass} type="submit">{submitButtonText}</button>
          <button className={cancelButtonClass} onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;

  // if (errors.length) {
  //   errorsDisplay = (
  //     <div>
  //       <h2 className="validation--errors--label">Validation errors</h2>
  //       <div className="validation-errors">
  //         <ul>
  //           {errors.map((error, i) => <li key={i}>{error}</li>)}
  //         </ul>
  //         <p>
  //           {errors.map((error, i) => `${error}, `)}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return errorsDisplay;
}
