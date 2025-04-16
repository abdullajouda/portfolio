import 'package:flutter/material.dart';

Route createRoute(Widget screen) {
  return PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => screen,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      const beginOffset = Offset(0.0, 1.0); // Slide from bottom
      const endOffset = Offset.zero;
      const curve = Curves.ease;

      final tween = Tween(begin: beginOffset, end: endOffset)
          .chain(CurveTween(curve: curve));
      final fadeTween = Tween<double>(begin: 0, end: 1);

      return SlideTransition(
        position: animation.drive(tween),
        child: FadeTransition(
          opacity: animation.drive(fadeTween),
          child: child,
        ),
      );
    },
    transitionDuration: const Duration(milliseconds: 500),
  );
}
