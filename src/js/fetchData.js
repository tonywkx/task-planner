
export function fetchData(){
    let urls = [
        'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users',
        'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks',
      ];
      // Преобразуем каждый URL в промис, возвращённый fetch
    let requests = urls.map(url => fetch(url));
      
    return Promise.all(requests).then(responses => Promise.all(responses.map(r => r.json())))
}