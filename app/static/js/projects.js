document.addEventListener('DOMContentLoaded', async function () {
  const errorBlock = document.getElementById('projects-error');
  const emptyState = document.getElementById('empty-state');
  const projectsList = document.getElementById('projects-list');
  const addform = document.getElementById('add-project-form');
  const submitBtn = document.getElementById('submit-project-btn');

  function showError(message) {
    errorBlock.textContent = message;
    errorBlock.classList.remove('hidden');
    setTimeout(() => errorBlock.classList.add('hidden'), 5000);
  }

  function hideError() {
    errorBlock.classList.add('hidden');
  }

  async function loadProjects() {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          emptyState.classList.remove('hidden');
          projectsList.innerHTML = '';
        } else {
          showError('Не удалось загрузить проекты');
        }
        return;
      }
      const data = await response.json();
      const projects = Object.values(data);
      console.log(projects);
      if (projects.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
        renderProjects(projects);
      }
    } catch (error) {
      showError('Ошибка сети при загрузке проектов');
      console.error(error);
    }
  }

  function renderProjects(projects) {
    projectsList.innerHTML = '';
    projects.forEach(function (project) {
      const card = document.createElement('div');
      card.className =
        'bg-[#FFFFFF] rounded-2xl shadow-md p-6 border border-[#f0dfe1] flex flex-col justify-between';
      card.innerHTML = `
      <div>
        <h4 class="text-xl font-bold text-[#8E3A4A] mb-2 break-all">${project.title}</h4>
        <a href="${project.repo_url}" target="_blank" class="text-sm text-[#B5566B] hover:underline break-all block mb-1">${project.repo_url}</a>
        <p class="text-sm text-gray-500 mb-4">${project.provider}</p>
        <a href="/projects/${project.id}" class="inline-block bg-[#B5566B] hover:bg-[#8E3A4A] text-white py-2 px-4 rounded-lg text-sm transition">Подробнее</a>
      </div>`;
      projectsList.appendChild(card);
    });
  }
  await loadProjects();

  addform.addEventListener('submit', async function (event) {
    event.preventDefault();
    hideError();

    const title = document.getElementById('project-title').value.trim();
    const repo_url = document.getElementById('project-repo').value.trim();
    const provider = document.getElementById('project-provider').value.trim();

    if (!title || !repo_url) {
      showError('Пожалуйста, заполните все поля');
      return;
    }

    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, repo_url, provider }),
      });

      const data = await response.json();

      if (response.ok) {
        addform.reset();
        await loadProjects();
      } else {
        showError(data.error || 'Ошибка при добавлении проекта');
      }
    } catch (error) {
      showError('Ошибка сети при добавлении проекта');
      console.error(error);
    } finally {
      submitBtn.disabled = false;
    }
  });
});
