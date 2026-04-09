"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const TrustSafety = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-6 md:px-12 lg:px-24">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl space-y-10"
      >
        <div className="flex items-center mb-2">
          <Link href="/">
            <Image
              src="/icons/rabbit.svg"
              alt="logo-rabbit"
              width={47}
              height={47}
            />
          </Link>
          <h1 className="flex-1 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mr-10">
            Trust & Safety
          </h1>
        </div>

        <p className="text-gray-500 text-sm text-center">
          Last updated: April 7, 2026
        </p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-gray-700 text-lg leading-relaxed"
        >
          At <span className="font-semibold text-blue-600">GPTiti</span>, we
          believe that trust is essential. This page explains how we protect
          users, handle data, and ensure a safe experience.
        </motion.p>

        {/* Why Users Choose GPTiti */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/rocket.svg"
              alt="logo-rocket"
              width={35}
              height={35}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Why Users Choose GPTiti
            </h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>No subscriptions — pay only for what you use</li>
            <li>Tokens never expire</li>
            <li>Free tokens every week</li>
            <li>Access to multiple AI models in one place</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            We aim to make AI more accessible, flexible, and fair.
          </p>
        </motion.div>

        {/* Your Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/lock.svg"
              alt="logo-lock"
              width={35}
              height={35}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Your Data & Privacy
            </h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>We only collect the data necessary to operate the Service</li>
            <li>
              We use{" "}
              <span className="font-semibold">Google authentication</span> — we
              do not store passwords
            </li>
            <li>
              We do <span className="font-semibold">not use cookies</span> for
              tracking or advertising
            </li>
            <li>
              We do{" "}
              <span className="font-semibold">not sell your personal data</span>
            </li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            Your chats belong to you:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>You can delete them at any time</li>
            <li>Once deleted, they are permanently removed from our systems</li>
          </ul>
        </motion.div>

        {/* Payments & Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/payment.svg"
              alt="logo-payment"
              width={35}
              height={35}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Payments & Transparency
            </h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>
              All payments are processed securely via{" "}
              <span className="font-semibold">Stripe</span>
            </li>
            <li>
              We do{" "}
              <span className="font-semibold">not store your card details</span>
            </li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            Simple and transparent pricing:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>No subscriptions</li>
            <li>No hidden fees</li>
            <li>No automatic charges</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">Tokens:</p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>never expire</li>
            <li>are pay-as-you-go</li>
            <li>are non-refundable</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
            You stay in full control of your spending.
          </p>
        </motion.div>

        {/* AI Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/robot.svg"
              alt="logo-robot"
              width={35}
              height={35}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              AI Transparency
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            GPTiti uses third-party AI models to generate responses.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            We are transparent about how this works:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>
              We do{" "}
              <span className="font-semibold">
                not own or train our own models
              </span>
            </li>
            <li>We provide access to leading AI systems via API</li>
            <li>
              Your prompts may be processed by these providers to generate
              results
            </li>
          </ul>
        </motion.div>

        {/* AI Risks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/warning.svg"
              alt="logo-warning"
              width={25}
              height={25}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              AI Risks
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            AI is powerful, but not perfect.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            You should be aware that:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>AI can produce incorrect or misleading information</li>
            <li>Responses are generated automatically and are not verified</li>
            <li>Content may contain biases or errors</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            Do not use GPTiti for:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>medical advice</li>
            <li>legal advice</li>
            <li>financial decisions</li>
            <li>any critical or high-risk use cases</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            You are responsible for how you use the outputs.
          </p>
        </motion.div>

        {/* Global Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/earth.svg"
              alt="logo-earth"
              width={30}
              height={30}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Global Access
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            GPTiti is available worldwide.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            We believe access to AI should not be limited by geography or
            expensive subscriptions.
          </p>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/shield.svg"
              alt="logo-shield"
              width={30}
              height={30}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Security
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            We take reasonable technical and organizational measures to protect:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>your account</li>
            <li>your data</li>
            <li>your usage</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            However, no online service can be 100% secure.
          </p>
        </motion.div>

        {/* Abuse Prevention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/eror.svg"
              alt="logo-eror"
              width={25}
              height={25}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Abuse Prevention
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            We work to prevent misuse of the platform.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            You may not use GPTiti for:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>illegal activities</li>
            <li>harmful or abusive content</li>
            <li>attempts to exploit the system</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            We may restrict access in case of abuse.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/mailbox.svg"
              alt="logo-mailbox"
              width={35}
              height={35}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Contact
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            If you have questions about trust, safety, or privacy:
          </p>
          <p className="text-blue-600 text-lg font-semibold">
            support@gptiti.com
          </p>
        </motion.div>

        {/* Our Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Image
              // className={styles.rabbitLogo}
              src="/icons/trust/lamp.svg"
              alt="logo-lamp"
              width={35}
              height={35}
            />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Our Philosophy
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            We built GPTiti to make AI:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
            <li>more accessible</li>
            <li>more flexible (no subscriptions)</li>
            <li>more fair (pay only for what you use)</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            Trust is a core part of that mission.
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default TrustSafety;
