document.addEventListener('DOMContentLoaded', () => {
    // --- PEMILIHAN ELEMEN DOM ---
    const candidateNameInput = document.getElementById('candidate-name-input');
    const startNominationBtn = document.getElementById('start-nomination-btn');
    const mcTriggerBtn = document.getElementById('mc-trigger-btn');
    const actionButtonsContainer = document.getElementById('action-buttons-container');
    const supportNominationBtn = document.getElementById('support-nomination-btn');
    const proposeObjectionBtn = document.getElementById('propose-objection-btn');
    const supportObjectionBtn = document.getElementById('support-objection-btn');
    const resetBtn = document.getElementById('reset-btn');

    const mcAnnouncementDisplay = document.getElementById('mc-announcement-display');
    const mcManualInput = document.getElementById('mc-manual-input');
    const submitMcManualBtn = document.getElementById('submit-mc-manual-btn');
    
    const currentCandidateDisplay = document.querySelector('#current-candidate-display span');
    const supportCountDisplay = document.getElementById('support-count');
    const objectionCountDisplay = document.getElementById('objection-count');
    const objectionStatusDisplay = document.getElementById('objection-status-display');

    // --- KEADAAN (STATE) APLIKASI ---
    let state;

    const initialState = () => ({
        candidateName: '',
        supportCount: 0,
        objectionCount: 0,
        isNominationActive: false,
        isObjectionProposed: false,
        finalResult: null
    });

    // --- FUNGSI UTAMA ---
    const updateDisplay = () => {
        currentCandidateDisplay.textContent = state.candidateName || 'Tiada';
        supportCountDisplay.textContent = state.supportCount;
        objectionCountDisplay.textContent = state.objectionCount;
        objectionStatusDisplay.classList.toggle('hidden', !state.isObjectionProposed);
    };
    
    const updateMcAnnouncement = (message) => {
        mcAnnouncementDisplay.textContent = message;
    };

    const resetProcess = () => {
        state = initialState();
        updateDisplay();
        updateMcAnnouncement('Selamat datang! Proses telah ditetap semula. Sila mulakan dengan memasukkan nama calon.');
        
        candidateNameInput.value = '';
        candidateNameInput.disabled = false;
        startNominationBtn.disabled = false;
        mcTriggerBtn.disabled = true;
        actionButtonsContainer.classList.add('hidden');
        proposeObjectionBtn.classList.remove('hidden');
        supportObjectionBtn.classList.add('hidden');
        mcManualInput.value = '';
    };
    
    const endProcess = (result) => {
        state.isNominationActive = false;
        state.finalResult = result;
        mcTriggerBtn.disabled = true;
        actionButtonsContainer.classList.add('hidden');
        
        const finalMessage = `Dengan ini disahkan, pencalonan bagi Saudara/Saudari ${state.candidateName} telah **${result.toUpperCase()}**! Majlis akan diteruskan dengan pencalonan seterusnya.`;
        updateMcAnnouncement(finalMessage);
    };

    const checkForResult = () => {
        if (state.supportCount >= 2) {
            endProcess('Diterima');
            return true;
        }
        if (state.objectionCount >= 2) {
            endProcess('Ditolak');
            return true;
        }
        return false;
    };

    // --- PENDENGAR PERISTIWA (EVENT LISTENERS) ---
    
    // **BARU: Fungsi untuk memulakan pencalonan**
    const handleStartNomination = () => {
        const name = candidateNameInput.value.trim();
        if (name === '') {
            alert('Sila masukkan nama calon terlebih dahulu.');
            return;
        }
        state.candidateName = name;
        state.isNominationActive = true;
        updateDisplay();
        
        updateMcAnnouncement(`Terima kasih saudara/saudari atas pencalonan tersebut. Pencalonan ini memerlukan 2 sokongan untuk diterima. Ada ahli majlis ingin menyokong pencalonan ini?`);
        
        candidateNameInput.disabled = true;
        startNominationBtn.disabled = true;
        mcTriggerBtn.disabled = false;
    };
    
    // Apabila MC mengklik butang "Buka Pencalonan"
    startNominationBtn.addEventListener('click', handleStartNomination);

    // **BARU: Apabila MC menekan 'Enter' pada medan input nama**
    candidateNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Menghalang sebarang tindakan 'default' pelayar
            handleStartNomination();
        }
    });

    mcTriggerBtn.addEventListener('click', () => {
        actionButtonsContainer.classList.remove('hidden');
        mcTriggerBtn.disabled = true;

        if (state.isObjectionProposed) {
            updateMcAnnouncement(`Dipersilakan saudara/saudari`);
            proposeObjectionBtn.classList.add('hidden');
            supportObjectionBtn.classList.remove('hidden');
        } else {
            updateMcAnnouncement(`Dipersilakan saudara/saudari.`);
            proposeObjectionBtn.classList.remove('hidden');
            supportObjectionBtn.classList.add('hidden');
        }
    });

    supportNominationBtn.addEventListener('click', () => {
        if (!state.isNominationActive) return;
        state.supportCount++;
        updateDisplay();
        actionButtonsContainer.classList.add('hidden');
        if (!checkForResult()) {
            updateMcAnnouncement(`Terima kasih saudari/saudari atas sokongan tersebut. Untuk pencalonan ini diterima, kami memerlukan lagi, ${2-state.supportCount} sokongan pencalonan, atau ${2-state.objectionCount} lagi sokongan bantahan untuk bantahan pencalonan diterima. Ada mana mana ahli majlis yang ingin menyokong pencalonan atau menyokong pembantahan pencalonan tersebut?`);
            mcTriggerBtn.disabled = false;
        }
    });

    proposeObjectionBtn.addEventListener('click', () => {
        if (!state.isNominationActive) return;
        state.isObjectionProposed = true;
        updateDisplay();
        actionButtonsContainer.classList.add('hidden');
        updateMcAnnouncement(`Terima kasih saudara/saudari atas bantahan pencalonan tersebut. Bantahan ini memerlukan 2 sokongan bagi bantahan pencalonon ini diterima.`);
        mcTriggerBtn.disabled = false;
    });

    supportObjectionBtn.addEventListener('click', () => {
        if (!state.isNominationActive) return;
        state.objectionCount++;
        updateDisplay();
        actionButtonsContainer.classList.add('hidden');
        if (!checkForResult()) {
            updateMcAnnouncement(`Terima kasih saudari atas sokongan bantahan tersebut. Untuk pencalonan ini diterima, memerlukan lagi ${2-state.supportCount} sokongan pencalonan, atau ${2-state.objectionCount} lagi sokongan bantahan untuk bantahan pencalonan diterima. Ada mana mana ahli majlis yang ingin menyokong pencalonan atau menyokong pembantahan pencalonan tersebut?`);
            mcTriggerBtn.disabled = false;
        }
    });

    submitMcManualBtn.addEventListener('click', () => {
        const manualText = mcManualInput.value.trim();
        if (manualText) {
            updateMcAnnouncement(manualText);
            mcManualInput.value = '';
        }
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Anda pasti ingin menetapkan semula keseluruhan proses? Semua data semasa akan hilang.')) {
            resetProcess();
        }
    });

    // --- MULAKAN APLIKASI ---
    resetProcess();
});