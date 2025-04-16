import 'package:flutter/material.dart';
import 'package:portfolio/helper/creare_route.dart';
import 'package:portfolio/views/contact_screen.dart';
import 'package:url_launcher/url_launcher.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;

  HomeScreen({required this.onToggleTheme});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<double>> _fadeAnimations;

  final List<Map<String, String>> projects = [
    {
      'title': 'Omniya',
      'desc': 'A plastic collection system that helps keep the environment clean.',
      'link': 'https://github.com/abdullajouda/Omnyia'
    },
    // {
    //   'title': 'Basit',
    //   'desc': 'Online shopping platform application for everything.',
    //   'link': 'https://github.com/abdullajouda/Basit'
    // },
    {
      'title': 'Fixed Bids',
      'desc': 'Bidding and selling items.',
      'link': 'https://github.com/abdullajouda/fixedbids'
    },
    {
      'title': 'Packigi',
      'desc': 'Great app for booking flights, trips and hotels.',
      'link': 'https://github.com/abdullajouda/Packigi'
    },
    {
      'title': 'Diners Hub',
      'desc': 'Great app for restaurants reservations.',
      'link': 'https://github.com/abdullajouda/DinersHub'
    },
  ];

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1200),
    );

    _fadeAnimations = List.generate(
      projects.length,
      (index) => CurvedAnimation(
        parent: _controller,
        curve: Interval(0.2 * index, 0.6 + 0.2 * index, curve: Curves.easeIn),
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget buildProjectCard(
      Map<String, String> project, Animation<double> animation) {
    return FadeTransition(
      opacity: animation,
      child: ProjectCard(
        title: project['title']!,
        description: project['desc']!,
        link: project['link']!,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // final isWide = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      appBar: AppBar(
         actions: [
          IconButton(
            icon: Icon(Icons.brightness_6),
            onPressed: widget.onToggleTheme,
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 60,
                backgroundImage: AssetImage('assets/profile.jpg'),
              ),
              SizedBox(height: 16),
              Text(
                "Hi, I'm John Doe",
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              Text(
                "Flutter Developer | UI/UX Enthusiast",
                style: Theme.of(context).textTheme.titleLarge,
              ),
              SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(context, createRoute(ContactScreen()));
                },
                icon: Icon(Icons.mail),
                label: Text("Contact Me"),
              ),
              SizedBox(height: 32),
              ConstrainedBox(
                constraints: BoxConstraints(maxWidth: 800),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Projects",
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ),
                    SizedBox(height: 16),
                    ...List.generate(
                      projects.length,
                      (index) => buildProjectCard(
                          projects[index], _fadeAnimations[index]),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProjectCard extends StatelessWidget {
  final String title;
  final String description;
  final String link;

  const ProjectCard({
    required this.title,
    required this.description,
    required this.link,
  });

  Future<void> _launchLink() async {
    final uri = Uri.parse(link);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      throw 'Could not launch $link';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 10),
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: Theme.of(context)
                    .textTheme
                    .headlineLarge
                    ?.copyWith(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(description),
            SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: _launchLink,
                icon: Icon(Icons.open_in_new),
                label: Text("View on GitHub"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
