const submit=document.getElementById("expense-add");
const table=document.getElementById("table-body");
const leaderboardtbl=document.getElementById("myTableShowLeaderBoard");
const downloadListtbl=document.getElementById("download-table");


const message=document.getElementById('msg');
// const message1=document.getElementById('msg1');
const premiumbtn=document.getElementById('premiusm-btn1');
const leaderboardbtn=document.getElementById('leaderboard-btn');
const pagination=document.getElementById('pagination');


submit.addEventListener('click',addexpense);
 leaderboardbtn.addEventListener('click',showleaderboard);



// Prevent the default behavior of the click event on the select element
const selectElement = document.getElementById("rowPerPage");
console.log(selectElement.value); 

selectElement.addEventListener("change", async () => {
  const selectedOption = selectElement.selectedOptions[0];
  console.log(`Selected option: ${selectedOption.value}`);  
  const rowsize=selectedOption.value;
  localStorage.setItem('pagesize',rowsize);
  const token=localStorage.getItem("user");

  const pageno=localStorage.getItem('pageno');
  const expensedata=await axios.get(`http://localhost:4000/getexpensedata?param1=${pageno}&param2=${rowsize}`,{headers: {"Authorization":token}});
        showPagination(
            expensedata.data.currentPage,
            expensedata.data.hasNextPage,
            expensedata.data.nextPage,
            expensedata.data.hasPreviousPage,
            expensedata.data.previousPage,
            expensedata.data.lastPage)
            table.innerHTML="";
        // for (let index = 0; index < expensedata.data.expensedata.length; index++) {
        // display(expensedata.data.expensedata[index]);
        // }
        display(expensedata);
          console.log(expensedata);

});


async function addexpense(event)
{
    try {
         event.preventDefault();
        const expense=document.getElementById("expens-money").value;
        const description=document.getElementById("expense-des").value;
        const choice=document.getElementById("drop-choice").value;

        if(expense!=='' && expense!==undefined && description!=='' && description!==undefined && choice!=='' && choice!==undefined)
        {
            const expensedata={
                expense,
                description,
                choice
            }
            const token=localStorage.getItem("user");
                const adddata= await axios.post("http://localhost:4000/addexpense",expensedata,{headers: {"Authorization":token}});
                if(adddata.data.success)
                {
                    console.log(adddata.data.msg);
                  //  display(expensedata);
                    addOnScreen(expensedata,adddata.data.userid);
                    // location.reload();
                }
            
        }else{
            console.log("something went wrong or Field might be empty");
        }
        
    } catch (error) {
         console.log(error);
         if(error.response)
         {
            console.log(error.response.data);
         }
    }
}

window.addEventListener('DOMContentLoaded',async(event)=>{
    try {
        const pageno=1;   
        localStorage.setItem('pageno',pageno);
        const token=localStorage.getItem("user");
        var pageSize = localStorage.getItem('pagesize') || 5;
        // var pageno = localStorage.getItem('pageno') || 1;
        console.log("token"+token);
        console.log("i am window listner");
       const expensedata=await axios.get(`http://localhost:4000/getexpensedata?param1=${pageno}&param2=${pageSize}`,{headers: {"Authorization":token}});
        console.log(expensedata);
        console.log(expensedata.data.ispremiumuser);
        // checkispremium(expensedata.data.ispremiumuser);

    
        if(expensedata.data.expensedata.length<=0)
        {
            message.innerHTML='<h1>No record found</h1>';
            document.getElementById("pagination").style.display='none';
            selectElement.style.display='none';
        }else
        {
            message.innerHTML='';
            display(expensedata);
        
        showPagination(
            expensedata.data.currentPage,
            expensedata.data.hasNextPage,
            expensedata.data.nextPage,
            expensedata.data.hasPreviousPage,
            expensedata.data.previousPage,
            expensedata.data.lastPage)
        }
             document.getElementById("pagination").style.display='block';
            selectElement.style.display='block';
    //    for (let index = 0; index < expensedata.data.expensedata.length; index++) {
    //     display(expensedata.data.expensedata[index]);
    //    }
       
    } catch (error) {
        console.log(error);
        if(error.response)
        {
           console.error(error.response.data.msg);
        }
    }
    
})




function display(expensedata)
{
    for (var index = 0; index < expensedata.data.expensedata.length; index++) {
        console.log(expensedata.data.expensedata[index].description);
              const tbl=` 
              <tr id=${expensedata.data.expensedata[index].id}>   
              <td hidden>${expensedata.data.expensedata[index].id}</td>
              <td>${expensedata.data.expensedata[index].expense}</td>
              <td>${expensedata.data.expensedata[index].choice}</td>
              <td>${expensedata.data.expensedata[index].description}</td>
              <td><button type="button" onclick=editexpense('${expensedata.data.expensedata[index].id}','${expensedata.data.expensedata[index].expense}','${expensedata.data.expensedata[index].expense}','${expensedata.data.expensedata[index].description}')>Edit</button></td>
              <td><button type="button" onclick=deletexpense('${expensedata.data.expensedata[index].id}')>Delete</button></td>

            </tr>`
            document.getElementById("table-body").innerHTML += tbl;

            
        // table.innerHTML+=tbl;
    }
    const numRows=table.rows.length;
  console.log(`There are ${numRows} rows in the table.`);
}

function addOnScreen(expensedata,userid)
{
    const numRows=table.rows.length;
    console.log(numRows);
    const pageno=parseInt(localStorage.getItem('pageno'));
    const pagesize=parseInt(localStorage.getItem('pagesize'));
    console.log(numRows,pagesize,pageno);
    const hasNextPage=pagesize<(pagesize*(pageno-1))+numRows+1;
    const nextPage=pageno+1;
    const hasPreviousPage=pageno>1;
    const previousPage=pageno-1;
    const lastPage=Math.ceil((numRows+1)/pagesize);
    console.log(pageno,
        hasNextPage,
        nextPage,
        hasPreviousPage,
        previousPage,
        lastPage);
        showPagination(
            pageno,
            hasNextPage,
            nextPage,
            hasPreviousPage,
            previousPage,
            lastPage
          )
    
    console.log(pageno,pagesize);
    if((pagesize)>numRows){
            const tbl=` 
            <tr id=${userid}>   
            <td hidden>${userid}</td>
            <td>${expensedata.expense}</td>
            <td>${expensedata.choice}</td>
            <td>${expensedata.description}</td>
            <td><button type="button" onclick=editexpense('${userid}','${expensedata.expense}','${expensedata.expense}','${expensedata.description}')>Edit</button></td>
            <td><button type="button" onclick=deletexpense('${userid}')>Delete</button></td>

        </tr>`
         document.getElementById("table-body").innerHTML += tbl;
         
     }
  console.log(`There are ${numRows} rows in the table.`);

}

async function deletexpense(expenseid)
{
    try {
        const token=localStorage.getItem("user");
        const deletestatus= await axios.delete(`http://localhost:4000/deleteExpenseData/${expenseid}`,{headers: {"Authorization":token}});
        if(deletestatus.data.success)  
        {
            console.log(deletestatus.data.msg);
            deleteRow(expenseid);
        //     location.reload();
        }
    } catch (error) {
        console.log(error);
        if(error.response)
        {
            console.error(error.response.data.msg)
        }
    }
}

function deleteRow(id) {
    var table = document.getElementById("myTable");
    var row = document.getElementById(id);
    table.deleteRow(row.rowIndex);
  }


// function checkispremium(isuserpremium)
// {
    const isp=localStorage.getItem('ispremium');
    if(parseInt(isp)===1)
    {

        console.log("i am premium button"+localStorage.getItem('ispremium'))
        document.getElementById("premiusm-btn1").hidden = true;
        
        document.getElementById("leaderboard-btn").hidden = false;
        document.getElementById("download").hidden = false;
        document.getElementById("downloadfile").hidden = false;
        message1.style.display='block';
       // <input type="button" value="Premium" id="premiusm-btn"/>
    }
    else
    {
        message1.style.display='none';
        document.getElementById("premiusm-btn1").hidden = false;

        
        document.getElementById("leaderboard-btn").hidden = true;
        document.getElementById("download").hidden = true;
        document.getElementById("downloadfile").hidden = true;
    }
// }



let buttonclick=0;
let buttonclick1=0;

async function showleaderboard()
{ 
    leaderboardtbl.style.display='block';
    try {
        document.getElementById('table-body1').innerHTML='';
        if(buttonclick===0)
        {
            const token=localStorage.getItem("user");
            const expensedata=await axios.get("http://localhost:4000/getleaderboarddata",{headers: {"Authorization":token}});
            console.log("leaderboard data+"+expensedata.data.leaderedata[0].username);
            for (let index = 0; index < expensedata.data.leaderedata.length; index++) {
                // const element = expensedata.data[index];
                // console.log(expensedata.data[index].id);
                tbleleadboard(expensedata.data.leaderedata[index])
                
            }
            buttonclick=1;
            
        }else{
            buttonclick=0;
            leaderboardtbl.style.display='none'

        }
    } catch (error) {
        console.log(error);
    }
    
}



function tbleleadboard(data)
{
    const tbl=`<tr> 
                <td>${data.username}</td>
                <td>${data.totalexpense}</td>
              </tr>`
               leaderboardtbl.innerHTML+=tbl;
          document.getElementById('table-body1').innerHTML+=tbl;
        //    tbl+=leaderboardtbl.innerHTML;
}



  function download()
        {
            const token=localStorage.getItem("user");
            console.log(" i am download calling");
            axios.get("http://localhost:4000/downloaddata",{headers: {"Authorization":token}})
            .then((response)=>{
                if(response.status===200){
                    console.log(response.data.fileurl);
                    var a =document.createElement("a");  
                    a.href=response.data.fileurl;
                    a.download='expense.txt';
                    a.click();
                }else{
                    throw new Error(response.data.message);
                }
            })
            .catch(error=>{
                console.log(error)
            }) 
        
        }

async function downloadAllFile()
{
    try {
        document.getElementById('downloadAllExpenseTable').style.display='block'
        document.getElementById('expenseFile').innerHTML='';
        if(buttonclick1===0)
        {
                const token=localStorage.getItem("user");
            const DownloadFilelist= await axios.get("http://localhost:4000/downloaddataAllFile",{headers: {"Authorization":token}})
            .then((response)=>{
                    if(response.status===200){
                        console.log(response);
                        for (let index = 0; index < response.data.downloadFileData.length; index++) {
                            console.log('i am download data11');
                            downloadfiledata(response.data.downloadFileData[index]);
                        }
                    }
            })
            buttonclick1=1;
            
        }else{
            buttonclick1=0;
            document.getElementById('downloadAllExpenseTable').style.display='none'

        }

    } catch (error) {
        console.log(error);
    }
}

function downloadfiledata(data)
{
    const tbl=`<tr> 
                <td>${data.downloaddate}</td>
                <td>${data.filename}</td>
                <td><button type="button" onclick=downloadFile('${data.filename}')>Download</button></td>
              </tr>`
            //   downloadListtbl.innerHTML+=tbl;
              document.getElementById('expenseFile').innerHTML+=tbl;
}

function downloadFile(fileUrl) {
    var url = fileUrl; // replace with your file URL
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Expense.pdf'; // replace with your desired file name
    a.click();
  }


  function showPagination(
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
  )
  {
    //  table.innerHTML="";
    pagination.innerHTML='';
   if(hasPreviousPage){

    const btn2 =document.createElement('button')
    btn2.innerHTML = previousPage
    // btn2.addEventListener('click', () => getProducts(previousPage))
    btn2.addEventListener('click', function(event) {
        event.preventDefault();
        getProducts(previousPage);
      });
    
    pagination.appendChild(btn2)
    
    }
    
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    
    // btn1.addEventListener('click', ()=>getProducts(currentPage))
    btn1.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.setItem('pageno',currentPage);
        getProducts(currentPage);
      });
    //    localStorage.setItem('pageno',currentPage);
    
    pagination.appendChild(btn1)


    if (hasNextPage) {

        const btn3= document.createElement('button')
        btn3.innerHTML = nextPage
        //  localStorage.setItem('pageno',nextPage);
        console.log('i am next page');
        // btn3.addEventListener('click', ()=>getProducts(nextPage))
        btn3.addEventListener('click', function(event) {
            event.preventDefault();
            getProducts(nextPage);
          });
          
        
        pagination.appendChild(btn3)
    
    }
}
    

async function getProducts (page){
    // page.preventDefault();
    var pageSize = localStorage.getItem('pagesize') || 5;
    localStorage.setItem('pageno',page);
    table.innerHTML="";
    const token=localStorage.getItem("user");
    console.log("hey i am page callin");
    const expensedata=await axios.get(`http://localhost:4000/getexpensedata?param1=${page}&param2=${pageSize}`,{headers: {"Authorization":token}})
        console.log(expensedata.data+"dddd");
        // for (let index = 0; index <expensedata.data.expensedata.length; index++) {
        //     display(expensedata.data.expensedata[index]);
        //    }
        display(expensedata);
         
         showPagination(
            expensedata.data.currentPage,
            expensedata.data.hasNextPage,
            expensedata.data.nextPage,
            expensedata.data.hasPreviousPage,
            expensedata.data.previousPage,
             expensedata.data.lastPage)
    

 }

    