# Lumina Development

[日本語](/README_JA.md)

## Overview
This is the official website for [Lumina Development](https://lumina-group.github.io/Lumina/). Our site introduces our group’s technology, products, team information, and contact details. We provide quantum-resistant encryption solutions.

## Features
### Advanced Quantum-Resistant Technology
- **Post-Quantum Cryptography**: Our encryption library implements lattice-based, hash-based, and multivariate-based algorithms that resist attacks from quantum computers, ensuring your data remains secure for decades to come.
- **Python-First Development**: We offer an intuitive Python library with comprehensive documentation and examples, enabling developers of all skill levels to implement quantum-resistant encryption.
- **End-to-End Encryption**: Our messaging solution provides end-to-end encryption to guarantee the privacy and security of your communications.
- **Seamless Integration**: Designed as a drop-in replacement for conventional cryptographic functions, our solutions integrate smoothly with existing systems while minimizing implementation friction.
- **Future-Proof Security**: Backed by continuous research and regular updates addressing newly discovered vulnerabilities, our ever-evolving security solutions stay ahead of emerging quantum threats.

## Product Information
### AQE
AQE is our primary quantum-resistant encryption library for Python developers, offering an easy-to-use implementation of lattice-based encryption algorithms.

```python
# just 3 lines to generate quantum-resistant encryption
kex = QuantumSafeKEX()
transport = SecureTransport(await kex.exchange(peer_awa)[0])
encrypted = await transport.encrypt(your_data)
```

[GitHub Repository](https://github.com/Lumina-Group/AQE)

### Encapsule (Coming Soon)
Encapsule is an anonymous, secure messenger app designed for safe communication.
- It provides a messaging experience far more anonymous than existing solutions, combining the smooth usability of Discord with our proprietary quantum-resistant encryption library (AQE).

[GitHub Repository](https://github.com/Lumina-Group/Encapsule)

### Alzam (Implementation Coming Soon)
Our secure file storage solution protects your files using encryption that withstands quantum attacks.
- Transparent client-side encryption is applied before data leaves your device.
- Zero-knowledge architecture – our group never accesses your encryption keys.
- Granular access controls and permission management.
- Detailed audit logs that record all access attempts.

```python
from alzam import VaultClient
client = VaultClient(api_key="your_api_key")
financial_vault = client.create_vault("Financial Documents")
financial_vault.store_file(
    file_path="/path/to/tax_returns.pdf",
    description="2024 Tax Returns",
    tags=["taxes", "finance", "2024"]
)
tax_file = financial_vault.get_file("2024 Tax Returns")
tax_file.save_to("/path/to/destination/")
```

[GitHub Repository](https://github.com/Lumina-Group/alzam)

## About the Group
Lumina Development was established in 2025 by a team dedicated to developing quantum-resistant security solutions that are accessible to everyone in anticipation of the quantum computing era.

Currently, the project is led by its sole founder, but we are actively recruiting engineers and researchers who share our vision for a safer future.

We aim to collaborate with talented individuals from diverse backgrounds to transform cutting-edge cryptographic technology into practical security solutions.

## Contact
- [Discord](https://discord.gg/y9TURVfVyb)
- [X (Twitter)](https://x.com/Meowkawaii_jp)
- [Email](mailto:example.example.1.mm@icloud.com)

## License
© 2025 Lumina Development. All rights reserved.
