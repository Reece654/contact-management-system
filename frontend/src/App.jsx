// this file sets up all the page routes for the app

// brings in the router stuff so the app can switch between pages without reloading
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PasscodeEntry from './pages/PasscodeEntry';
import ContactList from './pages/ContactList';
import ContactDetail from './pages/ContactDetail';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';
import ChangePasscode from './pages/ChangePasscode';

// main app component that wraps everything in the router and lists all the pages
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* first page the user sees, has to enter the passcode to get in */}
        <Route path="/" element={<PasscodeEntry />} />

        {/* shows all saved contacts */}
        <Route path="/contacts" element={<ContactList />} />

        {/* shows one contacts full details */}
        <Route path="/contacts/:id" element={<ContactDetail />} />

        {/* form to add a new contact */}
        <Route path="/contacts/add" element={<AddContact />} />

        {/* form to edit an existing contact */}
        <Route path="/contacts/:id/edit" element={<EditContact />} />

        {/* page to change the system passcode */}
        <Route path="/settings/passcode" element={<ChangePasscode />} />
      </Routes>
    </BrowserRouter>
  );
}

// makes this component available so main.jsx can use it
export default App;