 
 let cl=console.log;
 
  const postForm =document.getElementById("postForm");
  const titleControl=document.getElementById("title");
  const contentControl=document.getElementById("content");
  const userIdControl=document.getElementById("userId");
  const addBtn=document.getElementById("addBtn");
  const updateBtn=document.getElementById("updateBtn");
  const postcontainer=document.getElementById("postcontainer");
  const loader=document.getElementById("loader")
  
   base_url=`https://crud-in-js-229e9-default-rtdb.firebaseio.com`
   post_url=`${base_url}/posts.json`

     const snackBar = (msg, icon) =>{
                  Swal.fire({
                  title: msg,
                  icon:icon,
                  timer:3000
            });
     }


    const onEdit = (ele) =>{
         editID=ele.closest(".col-md-4").id;
         cl(editID);

         localStorage.setItem("editID", editID)

           edit_URL=`${base_url}/posts/${editID}.json`

          fetch(edit_URL, {
            method:"GET",
            body:null,
            headers: {
            "content-type" : "Application/json",
            "Authorisation":"Token from LS"
         }
         })
         .then(res=>{
             return res.json()
         })
         .then(data=>{
            cl(data)
            titleControl.value=data.title;
            contentControl.value=data.body;
            userIdControl.value=data.userId;
            updateBtn.classList.remove("d-none");
            addBtn.classList.add("d-none");


         })
         .catch(err=>{
             cl(err)
         })
        
    }

    const onRemove = (ele) =>{
       let getConfirm=confirm("are you sure, you want remove this post")

       if(getConfirm){
          removeID=ele.closest(".col-md-4").id;
       cl(removeID)

       remove_url=`${base_url}/posts/${removeID}.json`

       fetch(remove_url,{
         method:"DELETE",
         body: null,
         headers:{
            "content-type" : "Application/json",
            "Authorisation":"Token from LS"
         }
       })
       .then(res=>{
         return res.json()
       })
       .then(res=>{
         cl(res)
         document.getElementById(removeID).remove()

         snackBar(`post ${removeID} id remove successfully`, "success")
       })
       .catch(err=>{
         cl(err)
       })
       }
    }
   
    



   const craeteCards = (arr) =>{
        let result=""

        arr.forEach(ele=>{
          result+=`
              <div class="col-md-4 mb-4" id="${ele.id}">
                 <div class="card h-100">
                     <div class="card-header">
                         <h3>${ele.title}</h3>
                     </div>
                     <div class="card-body">
                        <p>${ele.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                              <button type="button" class="btn btn-outline-success" onClick="onEdit(this)">Edit</button>
                                <button type="button" class="btn btn-outline-danger" onClick="onRemove(this)">Remove</button>
                     </div>
                 </div>
             </div>
          
          `
        })

        postcontainer.innerHTML=result;
   }



  const fetchAllcall = () =>{
      fetch(post_url,{
         method:"GET",
         body:null,
         headers: {
            "content-type" : "Application/json",
            "Authorisation":"Token from LS"
         }
      })
      .then(res=>{
          return res.json()
      })
      .then(data=>{
         cl(data)
     let postArr =[]
       for(const key in data){
          data[key].id=key
          postArr.unshift(data[key])
          craeteCards(postArr)
       }

      })
      .catch(err=>{
          cl(err)
      })
  }

  fetchAllcall()



   const onaddPost = (eve) =>{
        eve.preventDefault();

        newObj={
            title:titleControl.value,
            body:contentControl.value,
            userId:userIdControl.value,
        }

        postForm.reset()
        cl( newObj)

       fetch(post_url,{
         method:"POST",
         body: JSON.stringify(newObj),
         headers:{
             "content-type" : "Application/json",
            "Authorisation":"Token from LS"
         }
       })
       .then(res=>{
         return res.json()
       })
       .then(res=>{
          let id=(res)

          //create cards
          let colDiv=document.createElement("div")
          colDiv.className="col-md-4 mb-4"
          colDiv.id=id.name;
          colDiv.innerHTML=`
                          <div class="card h-100">
                     <div class="card-header">
                         <h3>${newObj.title}</h3>
                     </div>
                     <div class="card-body">
                        <p>${newObj.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                              <button type="button" class="btn btn-outline-success" onClick="onEdit(this)">Edit</button>
                                <button type="button" class="btn btn-outline-danger" onClick="onRemove(this)">Remove</button>
                     </div>
                 </div>
          
          `
             postcontainer.prepend(colDiv) 
             snackBar(`new post created successfully`, "success")
       })

             
       
   }

   const onupdateBtn = () =>{
         let updateID=localStorage.getItem("editID")
      let updateObj={
             title:titleControl.value,
            body:contentControl.value,
            userId:userIdControl.value,
      }

      postForm.reset();

      update_url=`${base_url}/posts/${updateID}.json`

      fetch(update_url, {
         method:"PATCH",
         body:JSON.stringify(updateObj),
          headers:{
             "content-type" : "Application/json",
            "Authorisation":"Token from LS"
         }
      })
      .then(res=>{
         return res.json
      })
      .then(res=>{
         cl(res)
             updateBtn.classList.add("d-none");
            addBtn.classList.remove("d-none");

            let card=document.getElementById(updateID).firstElementChild.children

            card[0].innerHTML=`<h3>${updateObj.title}</h3>`
            card[1].innerHTML=` <p>${updateObj.body}</p>`

            

           snackBar(`post ${updateID} id updated successfully`, "success") 
      })
      .catch(err=>{
         cl(err)
      })
         
   }


  updateBtn.addEventListener("click", onupdateBtn)
  postForm.addEventListener("submit", onaddPost)