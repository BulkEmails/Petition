// Load congressmen data from JSON
fetch('congressmen.json')
    .then(response => response.json())
    .then(data => {
        const congressmen = data.congressmen;

        // Select HTML elements
        const congressmanDropdown = document.getElementById('congressmanDropdown');
        const constituencyDropdown = document.getElementById('constituencyDropdown');
        const emailTextArea = document.getElementById('emailText');

        // Default email body text for when no selection is made
        const defaultEmailBody = `Dear Congressman,
I hope this message finds you well. As a US citizen of Pakistani origin, I deeply value the commitment of Congressmen towards protecting democracy and human rights around the globe. Your recent letter to President Biden, though well-intended, does not fully account for the realities and complexities on ground and misrepresents certain aspects of the situation. 
I believe that facts have been biasedly presented due to the influence of coordinated campaigns by selected members of PTI. Pakistan’s recent elections were conducted under the supervision of international observers, including UN, and were found to meet acceptable standards without any significant concerns of fraud or irregularities. It may be noted that PTI not only won elections in KPK province but also emerged as the largest party in National assembly. Still their choice to reject the elections, is comprehensible as they failed to form the federal govt. 
The letter, focuses on one political party aimed and show a clear bias. In reality, Mr. Imran Khan faces numerous criminal charges, some of which have been validated by lower courts, and his trials are ongoing in accordance with Pakistan's judicial system. I believe it may be premature to portray Mr. Khan's imprisonment as purely politically motivated or as a result of human rights violations without acknowledging the broader legal context.
Moreover, Mr. Khan's divisive political approach, including his failure to foster inclusivity and his rhetoric for civil disobedience, coupled with violent protests incited by his supporters, has resulted in a lot of instability in Pakistan.
Mr. Khan's controversial stances, such as his support for the Taliban during the US military efforts in Afghanistan and his characterization of Osama bin Laden as a "martyr," have caused significant concerns both domestically and internationally (ineligibility for Oxford Chancellorship is a testimonial). Content propagated in articles of different websites cited in your letter may not have fully captured the complexities of the legal cases surrounding Mr. Khan and the broader political environment in Pakistan.
It is important to acknowledge that Pakistan's political landscape is deeply complex. The country faces numerous internal challenges, including terrorism, economic difficulties, and political instability. Any undesirable external pressure on the government may unintentionally exacerbate these issues, making it harder to foster a peaceful and stable democracy. It is essential that the US continues working with all stakeholders in Pakistan, rather than applying pressures which might alienate important partners and destabilize the region further.
I urge you to reconsider your stance, in light of the points I have raised, before making further statements regarding Pakistan’s internal affairs.
Regards`;

        // Display initial default email body
        emailTextArea.textContent = defaultEmailBody;

        // Populate the dropdowns with options
        congressmen.forEach(congressman => {
            const congressmanOption = document.createElement('option');
            congressmanOption.value = congressman.name;
            congressmanOption.textContent = congressman.name;
            congressmanDropdown.appendChild(congressmanOption);

            const constituencyOption = document.createElement('option');
            constituencyOption.value = congressman.constituency;
            constituencyOption.textContent = congressman.constituency;
            constituencyDropdown.appendChild(constituencyOption);
        });

        // Function to set up email button with a specific group of congressmen
        function setupEmailButton(group, buttonId) {
            const sendButton = document.getElementById(buttonId);

            sendButton.addEventListener("click", function () {
                const emailAddresses = group.map(congressman => congressman.email).join(',');
                const emailBody = defaultEmailBody;
                const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent('Concerns from a constituent')}&body=${encodeURIComponent(emailBody)}`;

                // Set mailto link and update email content preview in textarea
                sendButton.href = mailtoLink;
                emailTextArea.textContent = emailBody;
            });
        }

        // Divide congressmen into 6 groups of 10 each
        const groups = Array.from({ length: 6 }, (_, i) => congressmen.slice(i * 10, i * 10 + 10));

        // Set up each button to send email to a specific group
        setupEmailButton(groups[0], 'sendEmailButton1');
        setupEmailButton(groups[1], 'sendEmailButton2');
        setupEmailButton(groups[2], 'sendEmailButton3');
        setupEmailButton(groups[3], 'sendEmailButton4');
        setupEmailButton(groups[4], 'sendEmailButton5');
        setupEmailButton(groups[5], 'sendEmailButton6');

        // Update mailto link based on dropdown selection
        function updateMailtoLink(selectedCongressman, selectedConstituency) {
            let selectedCongressmen;
            let emailBody;

            if (selectedCongressman || selectedConstituency) {
                // Find selected congressman
                const congressmanData = congressmen.find(
                    congressman => congressman.name === selectedCongressman || congressman.constituency === selectedConstituency
                );
                
                if (congressmanData) {
                    emailBody = `Dear ${congressmanData.name},
I hope this message finds you well. [Custom email content here] Regards,`;

                    // Set recipient to the selected congressman only
                    selectedCongressmen = [congressmanData];

                    // Synchronize dropdowns
                    if (selectedCongressman) {
                        constituencyDropdown.value = congressmanData.constituency;
                    } else {
                        congressmanDropdown.value = congressmanData.name;
                    }
                }
            } else {
                // Default to 10 random congressmen
                selectedCongressmen = groups[0];
                emailBody = defaultEmailBody;
            }

            if (selectedCongressmen.length) {
                const emailAddresses = selectedCongressmen.map(congressman => congressman.email).join(',');
                const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent('Concerns from a constituent')}&body=${encodeURIComponent(emailBody)}`;

                sendButton.href = mailtoLink;
                emailTextArea.textContent = emailBody;
            } else {
                emailTextArea.textContent = '';
                sendButton.href = '#';
            }
        }

        // Initialize mailto link with default group
        updateMailtoLink(null, null);

        // Event listeners for dropdowns
        congressmanDropdown.addEventListener('change', function () {
            updateMailtoLink(this.value, null);
        });

        constituencyDropdown.addEventListener('change', function () {
            updateMailtoLink(null, this.value);
        });
    })
    .catch(error => console.error('Error loading congressman data:', error));
