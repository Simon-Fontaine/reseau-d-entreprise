export function ValuesSection() {
  return (
    <section className="rounded-2xl bg-muted/30 p-8 md:p-12 lg:p-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
            Our Values
          </h2>
          <p className="mt-2 text-muted-foreground">
            The principles that guide us.
          </p>
        </div>

        <div className="space-y-6 text-muted-foreground md:text-lg lg:w-2/3 lg:text-xl leading-relaxed">
          <p>
            At the core of our mission is a commitment to{" "}
            <strong className="text-foreground">Community First</strong>. We
            believe language learning is a social activity and foster a
            supportive environment where learners and tutors connect deeply.
          </p>
          <p>
            We strive for{" "}
            <strong className="text-foreground">Excellence in Teaching</strong>.
            Our tutors are carefully vetted and passionate about sharing their
            knowledge, ensuring that quality education remains our top priority.
          </p>
          <p>
            Driven by a{" "}
            <strong className="text-foreground">Passion for Languages</strong>,
            we celebrate the cultures they represent. Finally, we guarantee{" "}
            <strong className="text-foreground">Trust & Safety</strong>,
            providing a secure platform where your privacy is fundamental.
          </p>
        </div>
      </div>
    </section>
  );
}
