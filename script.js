inp=document.getElementById("ex")
btn = document.getElementById("done")
list = document.getElementById("mylist")
clear = document.getElementById("clear")

let sites = []


function clear_sites(){
    sites=[]
    updateDOM()
    update_sites()
    sync()
}

function add_site(){
    let val = inp.value
    sites.push(val)
    sync()
    update_sites()
    updateDOM()
    inp.value=""
}

function remove_site(){
    
}

function update_sites(){
    if(sites.length!=0){
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules : [
                {
                    "id": 1,
                    "priority": 1,
                    "action": {
                        "type": "block", 
                        },
                    "condition": {
                        "resourceTypes": ["main_frame"], 
                        "requestDomains": sites
                    }
                }
            ],
            removeRuleIds : [1]
        })

    }
    else{
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules : [
                {
                    "id": 1,
                    "priority": 1,
                    "action": {
                        "type": "allow", 
                        },
                    "condition": {
                        "resourceTypes": ["main_frame"]
                    }
                }
            ],
            removeRuleIds : [1]
        })
    }
}


function sync(){
    localStorage.setItem("blocked", sites.join(";"))
}

function updateDOM(){
    list.innerHTML=""
    for(s of sites){
        li=document.createElement("li")
        li.classList.add("list-group-item" ,"d-flex", "justify-content-between","bg-secondary","bg-gradient", "text-white", "p-2", "my-1")
        li.innerHTML=
        `<div>${s}</div>
        <button class="btn btn-danger btn-sm">Unblock</button>`
        li.addEventListener('click', function(e){
            sites.splice(sites.indexOf(e.target.value))
            update_sites()
            sync()
            updateDOM()
            
        })
        list.appendChild(li)
    }
}


function init(){
    btn.addEventListener('click', add_site)
    clear.addEventListener('click', clear_sites)
    temp = localStorage.getItem("blocked")
    if(temp){
        sites=temp.split(";")
    }
    updateDOM();
}

init()