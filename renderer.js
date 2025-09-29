const information = document.getElementById('info');
information.innerHTML = `This app is using Chrome (v${versions.chrome()})`; 


document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle();
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system();
  document.getElementById('theme-source').innerHTML = 'System';
})

const func = async () => {
  const response = await window.versions.ping();
  console.log(response);
}

func();