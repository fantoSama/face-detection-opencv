import React, { useState } from "react";
import { Link } from "react-router-dom";

function Upload(props) {

  // TODO make sure to delete any useless comments
  const defaultImageUrl = '/img/default.jpg';

  const initialFieldValues = {
    orderId: crypto.randomUUID(),
    userName: '',
    email: '',
    imageName: '',
    imageUrl: defaultImageUrl,
    imageFile: null
  }

  const [order, setOrder] = useState(initialFieldValues);


  const styles = {
    file: "text-[16px] bg-white text-black rounded-[10px] outline-none my-1 sm:my-3 w-72 sm:w-[400px]",
    input: "my-1 border-[1px] sm:my-3 px-3 sm:w-[400px] w-72 h-8 rounded-[10px] text-black bg-slate-50",
    button: "bg-[#1bd4f1] py-2 px-3 rounded-[10px] mt-4"
  }

  const [isValid, setisValid] = useState({})

  const resetOrder = () => {
    setOrder(initialFieldValues);
    order.orderId = crypto.randomUUID();
    document.getElementById("image-uploader").value = null;
  }

  const postOrder = () => {
    // posting order date to the api
    // TODO add the endpoint
    fetch("endpoint",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      }
    ).then(() => {
      console.log("order post to the api");
    })

    resetOrder();
  }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    })
  }


  const showPreview = e => {
    if (e.target.files && e.target.files[0]) {  // if the files array contained in the event e is set and its first value is valid 
      let imgFile = e?.target.files[0]; // then store it in the imgFile variable
      const reader = new FileReader();
      reader.onload = x => {

        setOrder({
          ...order,
          imageFile: imgFile,
          imageUrl: x.target.result,
        })
      }
      reader.readAsDataURL(imgFile);
    } else {
      setOrder({
        ...order,
        imageFile: null,
        imageUrl: defaultImageUrl,
      })
    }
  }

  const Validate = () => {
    const fieldValidator = {};
    fieldValidator.userName = order.userName === "" ? false : true;
    fieldValidator.email = order.email === "" ? false : true;
    fieldValidator.imageUrl = order.imageUrl === defaultImageUrl ? false : true;
    setisValid(fieldValidator);
    // return fieldValidator.email && fieldValidator.name && fieldValidator.imageUrl;
    // Object.value will return all elements of fieldValidator 
    // then with every the iterate through thoses elements and test if all of them are true => if so then the whole instruction if true
    return Object.values(fieldValidator).every(x => x === true);
  }


  const applyErrorStyle = (field) => {
    if (field && isValid[field] === false) {
      return " border-red-700 text-red-700";
    } else {
      return '';
    }
  }

  const handleFormSubmit = e => {
    e.preventDefault();
    if (Validate()) {
      console.log("the form is valid");
      console.log("id of this order is: " + order.orderId);
      postOrder();
    } else {
      console.log("this form is not valid");
      console.log(applyErrorStyle())
    }
  }

  const params = {
    userName: order.userName,
    orderId: order.orderId,
  }


  return (
    <>
      <div className="flex flex-col items-center justify-center md:h-[100vh] md:pt-0 pt-10 h-full mx-auto">
        <div>
          <img className="w-[350px] h-[250px] sm:h-[450px] sm:w-[550px] md:h-[550px] md:w-[700px]" src={order.imageUrl} alt="selected" />
        </div>
        <div className="my-4">
          <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center" autoComplete="off" noValidate>
            <input type="file" id="image-uploader" className={styles.file + applyErrorStyle("imageUrl")} name="imageFile" accept="image/*" onChange={e => showPreview(e)} />
            <input type="text" className={styles.input + applyErrorStyle("userName")} placeholder="enter your name" name="userName" value={order.userName} onChange={handleInputChange} />
            <input type="text" className={styles.input + applyErrorStyle("email")} placeholder="enter your email" name="email" value={order.email} onChange={handleInputChange} />
            <Link to="/confirmation" state={{ params: params }} ><button className={styles.button} type="submit">Submit Order</button></Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Upload;
