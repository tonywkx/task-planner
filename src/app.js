import './styles/normalize.css'
import './styles/style.css';
import { fetchData} from './js/fetchData';

window.onload = async function() {
    const [users, tasks] = await fetchData();
    renderBacklog(tasks)
    renderUsers(users)
    filterBacklog()
    renderGrid(tasks)
    makeTooltips()
}

const renderGrid = (tasks) => {
    const gridTemplate = document.querySelector('.planer-template');

    let filtered = tasks.filter(item => item.executor != null)

    filtered.forEach(({ executor, planStartDate, planEndDate, subject }, i) => {
        const gridEl = document.createElement('div');
        gridEl.classList.add('grid-item');
        gridEl.setAttribute('draggable', 'true')
        gridEl.setAttribute('id', `${i}`)
        gridEl.innerText = subject;

        let startDate = +planStartDate.slice(8);
        let endDate = +planEndDate.slice(8);

        if(startDate === 30){
            startDate = 0
            endDate = endDate + 2
        } else if(startDate === 31){
            startDate = 1
            endDate = endDate + 2
        } else{
            startDate = startDate + 1
            endDate = endDate + 2
        }

        let col = `${startDate}/${endDate}`
        let row = `${executor}/${executor}`

        gridEl.style.gridColumn = col;
        gridEl.style.gridRow = row;

        gridTemplate.appendChild(gridEl)
    })
}

const renderBacklog = (tasks) => {
    const backlogListEl = document.querySelector('.task-container');

    let filtered = tasks.filter(item => item.executor == null)

    filtered.forEach(({ executor, planStartDate, planEndDate, subject }, i) => {
        const listEl = document.createElement('li');
        listEl.classList.add('task-item')
        listEl.setAttribute('draggable', 'true')
        listEl.setAttribute('id', `t${i}`)
        listEl.innerText = subject;

        let startDate = +planStartDate.slice(8);
        let endDate = +planEndDate.slice(8);

        if(startDate === 30){
            startDate = 0
            endDate = endDate + 2
        } else if(startDate === 31){
            startDate = 1
            endDate = endDate + 2
        } else{
            startDate = startDate + 1
            endDate = endDate + 2
        }

        let col = `${startDate}/${endDate}`
        listEl.setAttribute('data-style', `${col}`)

        backlogListEl.appendChild(listEl);
    });
}

const renderUsers = (users) => {
    const usersList = document.querySelector('.user-container');

    users.forEach(({firstName, surname }, i) => {
        const userEl = document.createElement('li');
        userEl.classList.add('user-item')
        userEl.setAttribute('id', `${i}`)
        userEl.innerText = firstName + ' ' + surname;
        usersList.appendChild(userEl)
    })
}

const renderDates = () => {
    const datesWrap = document.querySelector('.dates')

    let now = new Date();
    let time = now.getTime();
    now = new Date(time - (time % 86400000));
    let arr = [];
    
    for (let i = 0; i < 14; i++, now.setDate(now.getDate() + 1)) {
        arr.push(`${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate() }.${(now.getMonth() + 1) < 10 ? `0${(now.getMonth() + 1)}` : (now.getMonth() + 1)}`  );
    }

    arr.forEach((date) => {
        const dateEl = document.createElement('div');
        dateEl.classList.add('date')
        dateEl.innerText = date;
        datesWrap.appendChild(dateEl);
    })    
}
renderDates()

const setId = () => {
    let datesList = document.querySelectorAll('.date')
    datesList.forEach((item, i) => item.setAttribute('id', `el${i}`))
    let today = document.querySelector('#el0')
    let state = today.innerText;
    today.innerText = state +'\n' + 'Сегодня'
    today.classList.add('today')
}
setId()

const filterBacklog = () => {
    let input = document.querySelector('#input')
    input.oninput = function(){
        let value = this.value.toLowerCase().trim()
        let list = document.querySelectorAll('.task-item')

        if(value){
            list.forEach((item) => {
                if(item.innerText.toLowerCase().search(value) == -1){
                    item.classList.add('hide');
                }
            })
        } else {
            list.forEach(item => item.classList.remove('hide'))
        }
    }
}

const fillGrid = () => {
    const blankElemAr = [...Array(350).keys()]
    const gridTemplate = document.querySelector('.planer-template');

    blankElemAr.forEach((item) => {
        const el = document.createElement('div');
        el.classList.add('empty-grid-item')
        gridTemplate.appendChild(el);
    })   
}
fillGrid()


const makeTooltips = () => {
    const tasks = document.querySelectorAll('.task-item')
    const gridTasks = document.querySelectorAll('.grid-item')

    gridTasks.forEach((task) => {
        const tooltip = document.createElement('span')
        tooltip.classList.add('tooltiptext')
        tooltip.innerText = 'Здесь текст подсказки:)'
        task.appendChild(tooltip)
    })

    tasks.forEach((task) => {
        const tooltip = document.createElement('span')
        tooltip.classList.add('tooltiptext')
        tooltip.innerText = 'Здесь текст подсказки:)'
        task.appendChild(tooltip)
    })
}

    const left = document.querySelector('#left')
    const right = document.querySelector('#right')
    const dates = document.querySelector('.dates')
    const grid = document.querySelector('.planer-template')

    right.addEventListener('click', () => {
        dates.classList.add('transform')
        grid.classList.add('transform')
    })
    left.addEventListener('click', () => {
        dates.classList.remove('transform')
        grid.classList.remove('transform')
    })

    //d&d

    const backlog = document.querySelector('.task-container')
    const gridTemplate = document.querySelector('.planer-template')
    const fullTemplate = document.querySelector('.template-container')

    backlog.addEventListener(`dragstart`, (event) => {
        event.target.classList.add(`selected`);
        event.dataTransfer.setData("text", event.target.id);
        let style = event.target.getAttribute('data-style')
        event.dataTransfer.setData("application/text", style)
        event.target.style.color = 'green';
      });
      
    fullTemplate.addEventListener(`dragstart`, (event) => {
        event.target.classList.add(`selected`);
        event.dataTransfer.setData("text", event.target.id);
        event.target.style.color = 'green';
      });
      
    backlog.addEventListener(`dragend`, (event) => {
        event.target.classList.remove(`selected`);
        event.target.classList.add(`grid-item`);
      });

      fullTemplate.addEventListener(`dragend`, (event) => {
        event.target.classList.remove(`selected`);
        event.target.classList.add(`grid-item`);
      });

      //dragover

      backlog.addEventListener("dragover", (event) => {
        event.target.style.backgound = 'blue';
        event.preventDefault();
      });

      fullTemplate.addEventListener("dragover", (event) => {
        event.target.style.backgound = 'blue';
        event.preventDefault();
      });

      //dragenter

      fullTemplate.addEventListener("dragenter", (event) => {
        if (event.target.classList.contains("empty-grid-item") || event.target.classList.contains("user-item")) {
            event.target.classList.add("dragover");
          }
      });

      fullTemplate.addEventListener("dragleave", (event) => {
        if (event.target.classList.contains("empty-grid-item") || event.target.classList.contains("user-item")) {
          event.target.classList.remove("dragover");
        }
      });

      //drop
 
      backlog.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text");

        event.target.appendChild(document.getElementById(data));
      });

      fullTemplate.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text");
        const styleData = event.dataTransfer.getData("application/text")

        if(event.target.classList.contains("user-item")){
            let item = document.getElementById(data)
            
            let id = +event.target.id + 1;
            let row = `${id}/${id}`;
            item.style.gridColumn = styleData;
            item.style.gridRow = row 
            gridTemplate.appendChild(item)
            return
        }
        event.target.appendChild(document.getElementById(data));
      });