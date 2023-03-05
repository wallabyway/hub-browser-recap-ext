import { initViewer, loadModel, loadTiles } from './viewer.js';
import { initTree } from './sidebar.js';

const login = document.getElementById('login');
const testQA = document.getElementById('testqa');
try {
    const resp = await fetch('/api/auth/profile');
    if (resp.ok) {
        const user = await resp.json();
        login.innerText = `Logout (${user.name})`;
        login.onclick = () => {
            const iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
            document.body.appendChild(iframe);
            iframe.onload = () => {
                window.location.replace('/api/auth/logout');
                document.body.removeChild(iframe);
            };
        }
        const viewer = await initViewer(document.getElementById('preview'));
		testQA.onclick = () => {
			loadModel(viewer, "dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLklHTGFfSjVXUkJhb3RyZTl1eS0wM3c/dmVyc2lvbj0x");
			loadTiles(viewer, "dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLl9QaVVaUXg3VFA2NmRlTkY1alNPR3c/dmVyc2lvbj0x");
		}
        initTree('#tree', (id, ext) => {
			const urn = window.btoa(id).replace(/=/g, '')
			if (ext == "rcs") 
				loadTiles(viewer, urn)
			else
				loadModel(viewer, urn)
		});
    } else {
        login.innerText = 'Login';
        login.onclick = () => window.location.replace('/api/auth/login');
    }
    login.style.visibility = 'visible';
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}
