import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ContactScreen extends StatefulWidget {
  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      final serviceId = 'service_24i2iy1';
      final templateId = 'template_0i0ppar';
      final userId = 'b_UBJ_z3PMaauOrCZ';

      final url = Uri.parse('https://api.emailjs.com/api/v1.0/email/send');

      try {
        final response = await http.post(
          url,
          headers: {
            'origin': 'http://localhost',
            'Content-Type': 'application/json',
          },
          body: json.encode({
            'service_id': serviceId,
            'template_id': templateId,
            'user_id': userId,
            'template_params': {
              'name': _nameController.text,
              'email': _emailController.text,
              'message': _messageController.text,
            },
          }),
        );

        if (response.statusCode == 200) {
          _showSuccessDialog();
        } else {
          _showErrorDialog();
        }
      } catch (e) {
        _showErrorDialog();
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) return "Please enter your email";
    final emailRegex = RegExp(r'^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(value) ? null : "Enter a valid email";
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Message Sent"),
        content: Text("Thanks ${_nameController.text}, I’ll get back to you soon!"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // close dialog
              Navigator.of(context).pop(); // back to home
            },
            child: Text("OK"),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Oops!"),
        content: Text("Something went wrong. Please try again later."),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text("OK"),
          ),
        ],
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text("Contact Me"),
        elevation: 0,
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  Text("Let's work together!", style: theme.textTheme.titleLarge),
                  SizedBox(height: 24),
                  TextFormField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      labelText: "Your Name",
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                    value == null || value.trim().isEmpty ? "Please enter your name" : null,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      labelText: "Your Email",
                      border: OutlineInputBorder(),
                    ),
                    validator: _validateEmail,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _messageController,
                    maxLines: 5,
                    decoration: InputDecoration(
                      labelText: "Message",
                      alignLabelWithHint: true,
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                    value == null || value.trim().isEmpty ? "Please enter a message" : null,
                  ),
                  SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: _isLoading ? null : _submitForm,
                    icon: Icon(Icons.send),
                    label: Text("Send"),
                  ),
                ],
              ),
            ),
          ),
          if (_isLoading)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}
